import Image from "next/image";

export default function Mascot({ speechTh, size = 120 }) {
  return (
    <div className="flex items-end gap-3">
      <Image src="/mascot.svg" alt="มาสคอตของแอป กำลังยืดเส้นยืดสาย" width={size} height={size} priority />
      {speechTh && (
        <div className="relative rounded-2xl rounded-bl-none bg-cream border-2 border-matcha-600 px-4 py-2 shadow-soft max-w-xs">
          <p className="font-body text-ink text-base leading-snug">{speechTh}</p>
        </div>
      )}
    </div>
  );
}
