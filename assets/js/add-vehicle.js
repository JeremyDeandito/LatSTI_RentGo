import { supabase } from '../api/supabase-config.js'
import { auth } from '../assets/chat/firebase-config.js'

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const fileInput = document.querySelector('input[type="file"]');
    const submitBtn = document.querySelector('.submit-btn');

    // Handle image upload to Supabase Storage
    async function uploadImage(file) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `vehicle-images/${fileName}`;

            const { data, error } = await supabase.storage
                .from('vehicles')
                .upload(filePath, file, {
                    headers: await getSupabaseHeaders()
                });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('vehicles')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    // Handle form submission
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const user = auth.currentUser;
                if (!user) {
                    throw new Error('User not authenticated');
                }

                submitBtn.disabled = true;
                submitBtn.textContent = 'Adding vehicle...';

                const formData = new FormData(form);
                let vehicleData = Object.fromEntries(formData);

                // Upload image if provided
                if (fileInput.files[0]) {
                    const imageUrl = await uploadImage(fileInput.files[0]);
                    vehicleData.image_url = imageUrl;
                }

                // Add vehicle to database
                const { data, error } = await supabase
                    .from('vehicles')
                    .insert([{
                        name: vehicleData.name,
                        brand: vehicleData.brand,
                        type: vehicleData.type,
                        transmission: vehicleData.transmission,
                        seats: parseInt(vehicleData.seats),
                        location: vehicleData.location,
                        price: parseFloat(vehicleData.price),
                        status: 'Available',
                        image_url: vehicleData.image_url,
                        owner_id: user.uid  // Use Firebase UID
                    }])
                    .select()
                    .single();

                if (error) throw error;

                alert('Vehicle added successfully!');
                window.location.href = 'vehicle-listings.html';

            } catch (error) {
                console.error('Error adding vehicle:', error);
                alert('Error adding vehicle. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            }
        });
    }

});