import { useState, useEffect } from 'react';
function useScrollDirection(e) {
    const [scrollDirection, setScrollDirection] = useState(null);

    useEffect(() => {
        const { offsetTop } = e.current
        let lastScrollY = offsetTop;

        const updateScrollDirection = () => {
            const { offsetTopNew } = e.current
            const scrollY = offsetTopNew;
            const direction = scrollY > lastScrollY ? "down" : "up";
            if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
                setScrollDirection(direction);
            }
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };
        window.addEventListener("scroll", updateScrollDirection); // add event listener
        return () => {
            window.removeEventListener("scroll", updateScrollDirection); // clean up
        }
    }, [scrollDirection]);

    return scrollDirection;
};

export default useScrollDirection;