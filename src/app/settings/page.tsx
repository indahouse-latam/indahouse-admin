'use client';

import { useState } from 'react';
import { useContracts } from '@/hooks/useContracts';
import { ContractsConfig } from '@/providers/ContractsProvider';
import { Save, RotateCcw, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { contracts, updateContracts, resetContracts } = useContracts();
    const [jsonInput, setJsonInput] = useState(JSON.stringify(contracts, null, 2));
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        try {
            const parsed: ContractsConfig = JSON.parse(jsonInput);

            // Basic validation
            if (!parsed.batch1 || !parsed.batch2 || !parsed.batch3 || !parsed.batch5) {
                throw new Error("Invalid structure. Must contain batch1, batch2, batch3, and batch5 objects.");
            }

            updateContracts(parsed);
            toast.success("Configuration saved successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Invalid JSON configuration. Please check the structure.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset to default values?")) {
            resetContracts();
            // We need to wait for the context to update or manually reset the input, 
            // but since resetContracts updates the context, and we initialize state from context...
            // Actually, we need to sync the input box with the new context value.
            // A simple way is to reload or just set the input to the default value derived from context after a timeout, 
            // or better, use an effect or key to force re-render.
            // For simplicity in this version:
            setTimeout(() => {
                window.location.reload();
            }, 100);
            toast.error("Configuration reset to defaults.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage smart contract addresses and system configuration.
                    </p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border bg-secondary/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-indigo-400" />
                        <h3 className="font-semibold">Smart Contract Registry</h3>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-500">
                        <strong>Warning:</strong> Modifying these addresses will affect all blockchain interactions within the admin panel.
                        Valid valid JSON structure required.
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase text-muted-foreground">Configuration JSON</label>
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="w-full h-[600px] font-mono text-xs bg-secondary/30 border border-border rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                            spellCheck={false}
                        />
                    </div>
                </div>

                <div className="p-6 bg-secondary/5 border-t border-border flex justify-end gap-4">
                    <button
                        onClick={handleReset}
                        className="px-6 py-2.5 rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors text-sm font-bold flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset Defaults
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </div>
        </div>
    );
}
