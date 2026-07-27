import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlass, CaretUp, CaretDown, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Seo from "@/components/site/Seo";
import { Section, SectionHeading } from "@/components/site/Primitives";
import { useCollection } from "@/hooks/useContent";

const PAGE_SIZE = 8;

export default function Tests() {
    const navigate = useNavigate();
    const { data: tests = [], isLoading } = useCollection("tests");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState({ key: "name", dir: "asc" });
    const [page, setPage] = useState(1);

    const categories = useMemo(() => ["all", ...Array.from(new Set(tests.map((t) => t.category)))], [tests]);

    const filtered = useMemo(() => {
        let rows = tests.filter((t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) &&
            (category === "all" || t.category === category)
        );
        rows.sort((a, b) => {
            const av = a[sort.key], bv = b[sort.key];
            const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
            return sort.dir === "asc" ? cmp : -cmp;
        });
        return rows;
    }, [tests, search, category, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const toggleSort = (key) => {
        setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));
    };

    const SortHead = ({ label, k }) => (
        <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 font-semibold hover:text-primary" data-testid={`sort-${k}`}>
            {label}
            {sort.key === k && (sort.dir === "asc" ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />)}
        </button>
    );

    return (
        <>
            <Seo title="Tests & Prices | Shree Balaji Pathology Lab" description="Browse our full catalogue of pathology tests with transparent prices, sample types, report times and preparation instructions." />
            <Section>
                <SectionHeading eyebrow="Test Catalogue" title="Tests & transparent prices" subtitle="Search, filter and sort our complete test menu." />

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input data-testid="test-search" placeholder="Search tests…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10 rounded-full h-11" />
                    </div>
                    <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
                        <SelectTrigger data-testid="category-filter" className="sm:w-56 rounded-full h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {categories.map((c) => <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                    <table className="w-full text-sm" data-testid="tests-table">
                        <thead className="bg-secondary/50 text-foreground">
                            <tr className="text-left">
                                <th className="px-5 py-4"><SortHead label="Test Name" k="name" /></th>
                                <th className="px-5 py-4 hidden md:table-cell"><SortHead label="Category" k="category" /></th>
                                <th className="px-5 py-4 hidden lg:table-cell">Sample</th>
                                <th className="px-5 py-4 hidden lg:table-cell">Report</th>
                                <th className="px-5 py-4"><SortHead label="Price" k="price" /></th>
                                <th className="px-5 py-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="border-t border-border"><td colSpan={6} className="px-5 py-4"><Skeleton className="h-6 w-full" /></td></tr>
                                ))
                                : paged.map((t) => (
                                    <tr key={t.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-foreground">{t.name}</div>
                                            <div className="text-xs text-muted-foreground">{t.preparation}</div>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell text-muted-foreground">{t.category}</td>
                                        <td className="px-5 py-4 hidden lg:table-cell text-muted-foreground">{t.sample_type}</td>
                                        <td className="px-5 py-4 hidden lg:table-cell text-muted-foreground">{t.report_time}</td>
                                        <td className="px-5 py-4 font-head font-bold text-primary">₹{t.price}</td>
                                        <td className="px-5 py-4"><Button size="sm" className="rounded-full" onClick={() => navigate(`/appointment?test=${encodeURIComponent(t.name)}`)}>Book</Button></td>
                                    </tr>
                                ))}
                            {!isLoading && paged.length === 0 && (
                                <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">No tests found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-6">
                    <span className="text-sm text-muted-foreground">{filtered.length} tests</span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="rounded-full" disabled={page === 1} onClick={() => setPage((p) => p - 1)} data-testid="prev-page"><CaretLeft size={16} /></Button>
                        <span className="text-sm font-medium">Page {page} / {totalPages}</span>
                        <Button variant="outline" size="icon" className="rounded-full" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} data-testid="next-page"><CaretRight size={16} /></Button>
                    </div>
                </div>
            </Section>
        </>
    );
}
