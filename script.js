document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Spotlight Effect Integration
    const spotlightContainers = document.querySelectorAll('[data-spotlight]');

    spotlightContainers.forEach(container => {
        const spotlight = document.createElement('div');
        spotlight.className = 'spotlight-effect';
        container.appendChild(spotlight);

        const textContent = container.querySelector('.spotlight-content');
        // Ensure only text nodes directly within p, h2, li are wrapped, or re-structure to target better
        // For simplicity, we'll target p, h3 and li within .spotlight-content here
        const textElements = textContent.querySelectorAll('p, h3, li');

        textElements.forEach(el => {
            // Check if element is a direct text container and not already processed
            if (el.children.length === 0 || Array.from(el.children).every(child => child.tagName === 'SPAN')) {
                const words = el.textContent.split(/\s+/); // Split by one or more spaces
                el.innerHTML = words.map(word =>
                    word ? `<span>${word}</span>` : '' // Handle empty strings from multiple spaces
                ).join(' ');
            }
        });

        let lastHighlighted = [];

        function updateSpotlight(e) {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            spotlight.style.left = `${x}px`;
            spotlight.style.top = `${y}px`;

            const toHighlight = [];
            const allSpans = textContent.querySelectorAll('span');

            allSpans.forEach(span => {
                const spanRect = span.getBoundingClientRect();
                const distance = Math.sqrt(
                    Math.pow(spanRect.left + spanRect.width / 2 - e.clientX, 2) +
                    Math.pow(spanRect.top + spanRect.height / 2 - e.clientY, 2)
                );
                if (distance < 150) { // Increased radius for more noticeable effect
                    toHighlight.push(span);
                }
            });

            // Remove highlight from words that are no longer in focus
            lastHighlighted.forEach(span => {
                if (!toHighlight.includes(span)) {
                    span.classList.remove('spotlight-highlight');
                }
            });

            // Add highlight to new words in focus
            toHighlight.forEach(span => {
                span.classList.add('spotlight-highlight');
            });

            lastHighlighted = toHighlight;
        }

        container.addEventListener('mousemove', updateSpotlight);
        container.addEventListener('mouseenter', () => {
            spotlight.style.opacity = '1';
        });
        container.addEventListener('mouseleave', () => {
            spotlight.style.opacity = '0';
            lastHighlighted.forEach(span => span.classList.remove('spotlight-highlight'));
            lastHighlighted = [];
        });
    });

    // Glitch effect re-trigger (optional, if you want it to re-animate on scroll/visibility)
    // You'd need an Intersection Observer for this, but for a simple load effect, it's fine.
});