import { useRef, useState } from "react";
import { toast } from "sonner";
import { UploadSimple, Spinner } from "@phosphor-icons/react";
import api, { fileUrl } from "@/lib/api";
import { Input } from "@/components/ui/input";

// Reusable image field: upload to storage OR paste a URL. Returns absolute url string.
export default function ImageUpload({ value, onChange, testid = "image-upload" }) {
    const ref = useRef();
    const [uploading, setUploading] = useState(false);

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
            onChange(fileUrl(data.url));
            toast.success("Image uploaded");
        } catch (err) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                {value ? (
                    <img src={value} alt="preview" className="h-16 w-16 rounded-lg object-cover border border-border" />
                ) : (
                    <div className="h-16 w-16 rounded-lg bg-secondary grid place-items-center text-muted-foreground text-xs">No image</div>
                )}
                <button type="button" onClick={() => ref.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors" data-testid={testid}>
                    {uploading ? <Spinner size={16} className="animate-spin" /> : <UploadSimple size={16} />} {uploading ? "Uploading…" : "Upload"}
                </button>
                <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
            <Input placeholder="…or paste image URL" value={value || ""} onChange={(e) => onChange(e.target.value)} className="h-9 text-xs" />
        </div>
    );
}
