import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface SignaturePadProps {
  onSignatureComplete: (signatureData: string) => void;
  onCancel: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSignatureComplete,
  onCancel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Get context
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#1f2937';
      setContext(ctx);
    }

    // White background
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
    setIsEmpty(false);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.closePath();
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !context) return;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const handleSign = () => {
    if (isEmpty) {
      alert('Please sign before submitting');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL('image/png');
    onSignatureComplete(signatureData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Sign Document
      </h3>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          Please sign below to accept this document. Your signature will be recorded and timestamped.
        </p>
      </div>

      {/* Signature Canvas */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-6">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full bg-white cursor-crosshair"
          style={{ height: '300px' }}
        />
      </div>

      {/* Guidelines */}
      <div className="flex items-start gap-2 text-xs text-gray-600 mb-6 p-3 bg-gray-50 rounded-lg">
        <span className="text-2xl leading-none">ℹ️</span>
        <p>
          Sign naturally in the box above. Your signature will be verified and legally binding on the document.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={clearSignature}
          disabled={isEmpty}
          className="flex-1"
        >
          <RotateCcw size={18} className="mr-2" />
          Clear
        </Button>

        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>

        <Button
          variant="success"
          onClick={handleSign}
          disabled={isEmpty}
          className="flex-1"
        >
          <Check size={18} className="mr-2" />
          Sign & Submit
        </Button>
      </div>

      {/* Legal Notice */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked
            className="mt-1 rounded"
          />
          <span className="text-xs text-gray-600">
            I acknowledge that by signing this document digitally, I accept all terms and conditions outlined above.
          </span>
        </label>
      </div>
    </div>
  );
};
