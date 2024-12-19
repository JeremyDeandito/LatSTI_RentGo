import { supabase } from '../api/supabase-config.js'
import { auth } from '../assets/chat/firebase-config.js'

document.addEventListener('DOMContentLoaded', async function() {
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.add-vehicle-btn')) {
            console.log('Button clicked through delegation');
            window.location.href = 'add-vehicle.html';
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
    console.log('Add Vehicle Button:', addVehicleBtn); // Debug line

    // Fetch vehicles function - updated to use Firebase UID
    async function fetchVehicles(search = '', status = 'All Status') {
        try {
            let query = supabase
                .from('vehicles')
                .select(`
                    *,
                    bookings (
                        id,
                        status,
                        start_date,
                        end_date
                    )
                `)
                .eq('owner_id', user.uid)  // Filter by Firebase UID
                .order('created_at', { ascending: false });

            if (search) {
                query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
            }

            if (status !== 'All Status') {
                query = query.eq('status', status);
            }

            const { data, error } = await query;

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            return [];
        }
    }

    // Delete vehicle function
    async function deleteVehicle(vehicleId) {
        try {
            // First check if user owns this vehicle
            const { data: vehicle, error: checkError } = await supabase
                .from('vehicles')
                .select('owner_id')
                .eq('id', vehicleId)
                .single();

            if (checkError) throw checkError;

            // Verify ownership
            if (vehicle.owner_id !== user.uid) {
                throw new Error('Unauthorized to delete this vehicle');
            }

            // Delete the vehicle
            const { error: deleteError } = await supabase
                .from('vehicles')
                .delete()
                .eq('id', vehicleId);

            if (deleteError) throw deleteError;

            // Refresh the table
            const vehicles = await fetchVehicles(
                searchInput?.value || '', 
                statusFilter?.value || 'All Status'
            );
            renderVehicles(vehicles);

        } catch (error) {
            console.error('Error deleting vehicle:', error);
            alert('Error deleting vehicle. Please try again.');
        }
    }

    // Render vehicles function
    function renderVehicles(vehicles) {
        if (!tableBody) return;
        
        tableBody.innerHTML = vehicles.map(vehicle => `
            <tr>
                <td>${vehicle.id.slice(0, 8)}</td>
                <td>${vehicle.name}</td>
                <td>${vehicle.brand}</td>
                <td>${vehicle.type}</td>
                <td>${vehicle.transmission}</td>
                <td>${vehicle.seats} Seats</td>
                <td>${vehicle.location}</td>
                <td>Rp${vehicle.price.toLocaleString()}</td>
                <td>
                    <span class="status-badge ${vehicle.status.toLowerCase()}">
                        ${vehicle.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="editVehicle('${vehicle.id}')">
                            <i data-lucide="pen-line"></i>
                        </button>
                        <button class="action-btn" onclick="deleteVehicle('${vehicle.id}')">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Reinitialize Lucide icons
        lucide.createIcons();
    }

    // Make deleteVehicle available globally
    window.deleteVehicle = deleteVehicle;

    // Edit vehicle function
    window.editVehicle = function(vehicleId) {
        window.location.href = `add-vehicle.html?id=${vehicleId}`;
    };

    // Initial load
    const vehicles = await fetchVehicles();
    renderVehicles(vehicles);

    // Search and filter handlers
    if (searchInput) {
        searchInput.addEventListener('input', async function() {
            const vehicles = await fetchVehicles(this.value, statusFilter?.value || 'All Status');
            renderVehicles(vehicles);
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', async function() {
            const vehicles = await fetchVehicles(searchInput?.value || '', this.value);
            renderVehicles(vehicles);
        });
    }

    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'login.html';
        }
    });
});