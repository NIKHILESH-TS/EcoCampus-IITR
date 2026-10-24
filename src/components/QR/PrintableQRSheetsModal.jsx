import React, { useState, useEffect } from 'react';
import { Printer, X, Download, Filter, Layers, CheckCircle2 } from 'lucide-react';
import { db, WASTE_TYPES } from '../../services/db';
import { generateBinQRCode } from '../../services/qrGenerator';

export default function PrintableQRSheetsModal({ isOpen, onClose }) {
  const [bins, setBins] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState('Block A');
  const [qrMap, setQrMap] = useState({});
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const allBins = db.getBins();
      setBins(allBins);
      generateAllQrs(allBins);
    }
  }, [isOpen]);

  const generateAllQrs = async (allBins) => {
    setIsGenerating(true);
    const map = {};
    // Pre-generate QR codes for current batch
    for (const b of allBins.slice(0, 48)) {
      map[b.id] = await generateBinQRCode(b.id);
    }
    setQrMap(map);
    setIsGenerating(false);
  };

  if (!isOpen) return null;

  const filteredBins = bins.filter(b => selectedBlock === 'All' || b.block === selectedBlock);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] border border-slate-200 shadow-card flex flex-col overflow-hidden">
        
        {/* Top Tool Bar (Hidden in Print) */}
        <div className="print:hidden p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>Govind Bhawan Bin Sticker Sheet Generator (200 Units)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Printable waterproof vinyl stickers for campus dustbins with embedded QR telemetry links.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
            >
              <option value="All">All Govind Bhawan (200 Bins)</option>
              <option value="Block A">Block A (44 Bins)</option>
              <option value="Block B">Block B (44 Bins)</option>
              <option value="Block C">Block C (44 Bins)</option>
              <option value="Block D">Block D (40 Bins)</option>
              <option value="Mess & Dining Hall">Mess Wing (16 Bins)</option>
            </select>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-subtle"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sticker Sheets</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Grid Canvas */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-100 print:bg-white print:p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
            {filteredBins.slice(0, 32).map(bin => {
              const type = WASTE_TYPES[bin.category] || WASTE_TYPES.recyclable;
              const qr = qrMap[bin.id];

              return (
                <div 
                  key={bin.id}
                  className="bg-white p-3.5 rounded-xl border-2 border-slate-300 print:border-slate-800 flex items-center gap-3 text-xs shadow-sm print:shadow-none break-inside-avoid"
                >
                  {/* Left QR */}
                  <div className="w-24 h-24 bg-white p-1 border border-slate-200 rounded flex-shrink-0 flex items-center justify-center">
                    {qr ? (
                      <img src={qr} alt={bin.id} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Generating...</span>
                    )}
                  </div>

                  {/* Right Details */}
                  <div className="flex-1 space-y-1">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                      IIT ROORKEE • ESTATE SWM CELL
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-base text-slate-900">
                        #{bin.id}
                      </span>
                      <span 
                        className="px-1.5 py-0.2 rounded text-[10px] font-bold text-white uppercase"
                        style={{ backgroundColor: type.colorHex }}
                      >
                        {type.label}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-800 text-[11px]">
                      {bin.block} • {bin.floor}
                    </div>

                    <div className="text-[9px] text-slate-500 leading-tight">
                      Shifts: <strong>07:30 AM</strong> • <strong>02:00 PM</strong> • <strong>08:30 PM</strong>
                    </div>

                    <div className="text-[8px] text-slate-400 border-t border-slate-100 pt-1">
                      Scan QR with phone to check cleaning times or report missed emptying.
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center py-6 text-xs text-slate-400 print:hidden">
            Showing first 32 bin stickers. Select block from dropdown to view other wings.
          </div>
        </div>

      </div>
    </div>
  );
}
