// בס"ד
import { useEffect, useRef } from "react";
import type { FC } from "react";
import { Html5Qrcode } from "html5-qrcode";
type ScanningProps = {
  setBarcode: (value: string) => void;
};
export const Scanning: FC<ScanningProps> = ({ setBarcode }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;
    const stopScanner = async () => {
      const { current } = scannerRef;
      if (!current) return;
      try {
        if (current.isScanning) {
          await current.stop();
        }
        current.clear();
      } catch (err) {
        console.warn("Stop error:", err);
      }
    };
    const startScanner = async () => {
      const { current } = scannerRef;
      if (!current || current.isScanning) return;
      try {
        await current.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            setBarcode(decodedText);
            void stopScanner();
          },
          (errorMessage) => {
            console.debug("Scan error:", errorMessage);
          },
        );
      } catch (err) {
        console.error("Scanner failed to start:", err);
      }
    };
    void startScanner();
    return () => {
      void stopScanner();
    };
  }, [setBarcode]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md bg-black rounded-3xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-500">QR Scanner</h1>
        </div>
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-green-500 shadow-inner">
          <div id="reader" className="w-full h-full
          " />
        </div>
        <div className="text-center text-xs text-green-400"></div>
      </div>
    </div>
  );
};
