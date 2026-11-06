import CiberAsistenteIA from '@/components/ai/CiberAsistenteIA';

export const metadata = {
    title: 'Unified Scan - NUMU',
    description: 'Configura escaneos con IA',
};

export default function UnifiedScanPage() {
    return (
        <div className="w-full">
            <CiberAsistenteIA />
        </div>
    );
}
