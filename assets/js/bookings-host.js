import { supabase } from '../api/supabase-config.js'
import { auth } from '../assets/chat/firebase-config.js'

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM Content Loaded');

    document.body.addEventListener('click', function(e) {
        const trackButton = e.target.closest('.action-btn');
        if (trackButton) {
            console.log('Track button clicked');
            const bookingId = trackButton.getAttribute('data-booking-id');
            if (bookingId) {
                window.location.href = `track-vehicle.html?id=${bookingId}`;
            }
        }
    });

    // Check authentication
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const tableBody = document.querySelector('.table tbody');
    const searchInput = document.querySelector('.search-input');
    const statusFilter = document.querySelector('.status-filter');

    // Fetch bookings function
    async function fetchBookings(search = '', status = 'All Status') {
        try {
            let query = supabase
                .from('bookings')
                .select(`
                    *,
                    vehicles (
                        name,
                        brand,
                        owner_id
                    ),
                    profiles (
                        full_name,
                        phone_number
                    )
                `)
                .eq('vehicles.owner_id', user.uid)  // Filter by host's Firebase UID
                .order('created_at', { ascending: false });

            if (search) {
                query = query.or(`vehicles.name.ilike.%${search}%,profiles.full_name.ilike.%${search}%`);
            }

            if (status !== 'All Status') {
                query = query.eq('status', status);
            }

            const { data, error } = await query;

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return [];
        }
    }

    // Render bookings function
    function renderBookings(bookings) {
        if (!tableBody) return;
        console.log('Rendering bookings:', bookings);
        
        tableBody.innerHTML = bookings.map(booking => `
            <tr>
                <td>${booking.id.slice(0, 8)}</td>
                <td>${booking.vehicles?.name || 'N/A'}</td>
                <td>${booking.vehicles?.brand || 'N/A'}</td>
                <td>${booking.profiles?.full_name || 'N/A'}</td>
                <td>${booking.profiles?.phone_number || 'N/A'}</td>
                <td>${new Date(booking.start_date).toLocaleDateString()}</td>
                <td>${new Date(booking.end_date).toLocaleDateString()}</td>
                <td>Rp${booking.total_price.toLocaleString()}</td>
                <td>
                    <span class="status-badge ${booking.status.toLowerCase()}">
                        ${booking.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <a href="track-vehicle.html?id=${booking.id}" class="action-btn">
                            <i data-lucide="arrow-right"></i>
                        </a>
                    </div>
                </td>
            </tr>
        `).join('');

        // Reinitialize Lucide icons
        lucide.createIcons();
    }

    // Initial load
    const bookings = await fetchBookings();
    renderBookings(bookings);

    // Search and filter handlers
    if (searchInput) {
        searchInput.addEventListener('input', async function() {
            const bookings = await fetchBookings(this.value, statusFilter?.value || 'All Status');
            renderBookings(bookings);
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', async function() {
            const bookings = await fetchBookings(searchInput?.value || '', this.value);
            renderBookings(bookings);
        });
    }

    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'login.html';
        }
    });
});
