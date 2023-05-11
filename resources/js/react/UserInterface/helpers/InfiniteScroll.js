import React, {useEffect, useRef} from 'react';

const InfiniteScroll = ({
                            children,
                            hasMore,
                            loadMore,
                            loader,
                            threshold = 0,
                        }) => {
    const observer = useRef();
    const lastElementRef = useRef();

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            },
            {rootMargin: `${threshold}px`}
        );

        if (lastElementRef.current) {
            observer.current.observe(lastElementRef.current);
        }

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [children, hasMore]);

    return (
        <>
            {children}
            {hasMore && (
                <div ref={lastElementRef}>
                    {loader}
                </div>
            )}
        </>
    );
};

export default InfiniteScroll;
