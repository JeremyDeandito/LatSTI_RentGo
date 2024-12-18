// Initialize map when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Map container not found!');
        return;
    }

    try {
        const map = L.map('map').setView([-6.2088, 106.8456], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Updated custom icon with fixed size
        const customIcon = L.divIcon({
            className: 'custom-pin-container',
            html: `
                <div class="custom-pin-pulse"></div>
                <div class="custom-pin"></div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            className: '', // Remove default className to prevent scaling
        });

        const marker = L.marker([-6.2088, 106.8456], {
            icon: customIcon,
            zIndexOffset: 1000 // Ensure pin stays above other map elements
        }).addTo(map);

        function updateVehiclePosition() {
            const lat = -6.2088 + (Math.random() - 0.5) * 0.01;
            const lng = 106.8456 + (Math.random() - 0.5) * 0.01;
            marker.setLatLng([lat, lng]);
            map.panTo([lat, lng]);
        }

        setInterval(updateVehiclePosition, 5000);
    } catch (error) {
        console.error('Error initializing map:', error);
    }

    lucide.createIcons();
});