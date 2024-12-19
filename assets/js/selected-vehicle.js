import { supabase } from '../api/supabase-config.js'
import { auth } from '../assets/chat/firebase-config.js'

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Check authentication
        const user = auth.currentUser;
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Get vehicle ID from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const vehicleId = urlParams.get('id');

        if (!vehicleId) throw new Error('No vehicle ID provided');

        // Fetch vehicle details
        const { data: vehicle, error } = await supabase
            .from('vehicles')
            .select(`
                *,
                owner:users(*)
            `)
            .eq('id', vehicleId)
            .single();

        if (error) throw error;

        // Update UI elements
        updateVehicleDetails(vehicle);

        // Handle booking form
        const bookingForm = document.querySelector('.booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                try {
                    const formData = new FormData(bookingForm);
                    
                    const { data: booking, error } = await supabase
                        .from('bookings')
                        .insert([{
                            vehicle_id: vehicleId,
                            user_id: user.uid,  // Use Firebase UID
                            start_date: formData.get('start_date'),
                            end_date: formData.get('end_date'),
                            status: 'Pending'
                        }])
                        .select()
                        .single();

                    if (error) throw error;

                    alert('Booking submitted successfully!');
                    window.location.href = 'bookings.html';

                } catch (error) {
                    console.error('Error submitting booking:', error);
                    alert('Error submitting booking. Please try again.');
                }
            });
        }

    } catch (error) {
        console.error('Error loading vehicle details:', error);
        alert('Error loading vehicle details');
    }

    // Initialize Lucide icons
    lucide.createIcons();
});

function updateVehicleDetails(vehicle) {
    document.querySelector('.car-name').textContent = vehicle.name;
    document.querySelector('.year').textContent = `${vehicle.year} •`;
    document.querySelector('.score').textContent = `${vehicle.rating} (${vehicle.review_count})`;
    
    const specs = document.querySelectorAll('.spec');
    specs[0].textContent = `${vehicle.seats} Seats`;
    specs[1].textContent = `${vehicle.luggage} Luggage`;
    specs[2].textContent = vehicle.transmission;
}