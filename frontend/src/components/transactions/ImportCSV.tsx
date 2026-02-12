import { useRef } from 'react';

interface ImportCSVProps {
    onImport: (file: File) => void;
}

export default function ImportCSV({ onImport }: ImportCSVProps) {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onImport(file);
    };

    return (
        <>
            <input
                ref={fileRef}
                type="file"
                accept=".csv"
                onChange={handleChange}
                className="hidden"
            />
            <button
                onClick={() => fileRef.current?.click()}
                className="btn-secondary flex items-center gap-2 text-sm"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import CSV
            </button>
        </>
    );
}
