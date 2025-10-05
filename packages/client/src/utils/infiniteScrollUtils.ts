import type {InfiniteScroolOptions} from "$types/infiniteScrollTypes";

export function setupInfiniteScroll(options: InfiniteScroolOptions): () => void {
    const { threshold = 300, loadMorePosts } = options;
    let isThrottled = false;

    const handleScroll = (event: Event) => {
        if (isThrottled) return;

        const target = event.target as HTMLElement;

        const scrollHeight = target.scrollHeight;
        const scrollTop = target.scrollTop;
        const clientHeight = target.clientHeight;

        if (scrollHeight - scrollTop - clientHeight < threshold) {
            isThrottled = true;
            loadMorePosts();

            setTimeout(() => {
                isThrottled = false;
            }, 500);
        }
    };

    const container = document.querySelector('#feed-page-container');

    if (!container) {
        console.warn('Container #feed-page-container not found');
        return () => {};
    }

    container.addEventListener('scroll', handleScroll);

    return () => {
        container.removeEventListener('scroll', handleScroll);
    };
}