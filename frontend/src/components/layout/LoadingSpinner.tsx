export default function LoadingSpinner({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) {
    const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className={`${sizeMap[size]} relative`}>
                <div className="absolute inset-0 rounded-full border-2 border-surface-700" />
                <div className="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
            </div>
            {text && <p className="text-sm text-surface-400 animate-pulse">{text}</p>}
        </div>
    );
}
