'use client';

import { useState, useEffect } from 'react';
import { getVehicles } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default function DebugPage() {
    const [config, setConfig] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Show what the browser sees as the API URL
        const envUrl = process.env.NEXT_PUBLIC_API_URL;
        setConfig({
            apiUrl: envUrl || 'UNDEFINED (Using default?)'
        });

        // Test Fetch
        getVehicles(1)
            .then(res => setData(res))
            .catch(err => setError(err.message));
    }, []);

    return (
        <div className="p-10 font-mono text-sm bg-gray-100 min-h-screen text-black">
            <h1 className="text-2xl font-bold mb-4">Vercel Debugger</h1>

            <div className="mb-8 p-4 bg-white rounded shadow text-black">
                <h2 className="font-bold mb-2 border-b pb-2">Environment Config</h2>
                <p>NEXT_PUBLIC_API_URL: <span className="font-bold text-blue-600">{config?.apiUrl}</span></p>
            </div>

            <div className="mb-8 p-4 bg-white rounded shadow text-black">
                <h2 className="font-bold mb-2 border-b pb-2">API Connection Test</h2>
                {error ? (
                    <div className="text-red-600 font-bold">ERROR: {error}</div>
                ) : !data ? (
                    <div className="text-gray-500">Loading...</div>
                ) : (
                    <div>
                        <p className="text-green-600 font-bold">SUCCESS</p>
                        <p>Total Vehicles: {data.meta?.total || 'N/A'}</p>
                        <p>First Vehicle: {data.data?.[0]?.model || 'None'}</p>
                        <pre className="mt-4 bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-60">
                            {JSON.stringify(data.data?.[0], null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
