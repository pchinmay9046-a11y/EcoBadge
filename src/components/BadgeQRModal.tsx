import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Badge, Attendee, CollegeEvent } from '../types';
import { X, Printer, Download, Sparkles, CheckCircle2 } from 'lucide-react';

interface BadgeQRModalProps {
  badge: Badge;
  attendee?: Attendee;
  event?: CollegeEvent;
  onClose: () => void;
}

export const BadgeQRModal: React.FC<BadgeQRModalProps> = ({ badge, attendee, event, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const payload = JSON.stringify({
      badgeId: badge.id,
      material: badge.material,
      reuseCount: badge.reuseCount,
      issuedTo: attendee?.name || 'Unassigned',
      event: event?.name || badge.currentEventName || 'General Circulation',
    });

    QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f291e', // Dark forest green
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR code:', err));
  }, [badge, attendee, event]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base tracking-tight">EcoBadge Identifier</span>
            <span className="text-xs bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded font-mono">
              {badge.id}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge Physical Card Mockup */}
        <div className="p-6">
          <div className="border-2 border-dashed border-emerald-300 rounded-xl p-5 bg-linear-to-b from-emerald-50/50 to-white text-center">
            {/* Lanyard Attachment Slot */}
            <div className="w-12 h-2.5 mx-auto mb-4 bg-slate-300 rounded-full" />

            <div className="text-xs uppercase tracking-wider font-bold text-emerald-800 mb-1">
              {event?.name || badge.currentEventName || 'Campus Event Pass'}
            </div>

            <div className="text-xl font-bold text-slate-900 mt-1">
              {attendee?.name || badge.currentAttendeeName || 'Reusable Asset'}
            </div>

            <div className="text-xs text-slate-500 font-mono mt-0.5">
              {attendee?.participantId || attendee?.role || 'Campus Pass Holder'}
            </div>

            {/* QR Image */}
            <div className="my-4 flex justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code for Badge ${badge.id}`}
                  className="w-44 h-44 rounded-lg border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-44 h-44 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Micro Details */}
            <div className="grid grid-cols-2 gap-2 text-left bg-white p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Material</span>
                <span className="font-medium text-slate-700">{badge.material}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Lifetime Reuses</span>
                <span className="font-medium text-emerald-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {badge.reuseCount} uses
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Condition</span>
                <span className="font-medium text-slate-700">{badge.condition}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Status</span>
                <span className="font-medium text-slate-700">{badge.status}</span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Return to collection desk at end of session.</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            Print Badge Pass
          </button>
          {qrDataUrl && (
            <a
              href={qrDataUrl}
              download={`${badge.id}-qr-code.png`}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors"
            >
              <Download className="w-4 h-4" />
              Save QR Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
