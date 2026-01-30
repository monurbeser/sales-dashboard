"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { managerSchema } from "@/lib/validation";

export type Manager = {
  id: string;
  fullName: string;
  createdAt: string;
};

export function ManagersClient() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Manager | null>(null);
  const [fullName, setFullName] = useState("");

  const loadManagers = async () => {
    setLoading(true);
    const response = await fetch("/api/managers");
    const data = await response.json();
    setManagers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadManagers();
  }, []);

  const submit = async () => {
    const parsed = managerSchema.safeParse({ fullName });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Geçersiz ad soyad");
      return;
    }

    const response = await fetch(editing ? `/api/managers/${editing.id}` : "/api/managers", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: parsed.data.fullName })
    });

    if (!response.ok) {
      toast.error("Kaydetme başarısız");
      return;
    }

    toast.success("Kaydedildi");
    setFullName("");
    setEditing(null);
    await loadManagers();
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/managers/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Silme başarısız");
      return;
    }
    toast.success("Silindi");
    await loadManagers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Satış Yöneticileri</h1>
          <p className="text-sm text-muted-foreground">2026 yılı için satış yöneticilerini yönetin.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null);
                setFullName("");
              }}
            >
              Yeni Yönetici
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Satış yöneticisi ekle</DialogTitle>
              <DialogDescription>Ad soyad bilgisi zorunludur.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Ad Soyad"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
              <Button onClick={submit}>Kaydet</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Yükleniyor...
        </div>
      ) : managers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Henüz satış yöneticisi yok. Yeni bir yönetici ekleyin.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>Oluşturma</TableHead>
              <TableHead className="text-right">Aksiyonlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager.id}>
                <TableCell className="font-medium">
                  <Link className="text-primary hover:underline" href={`/managers/${manager.id}`}>
                    {manager.fullName}
                  </Link>
                </TableCell>
                <TableCell>{new Date(manager.createdAt).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell className="flex flex-wrap justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditing(manager);
                          setFullName(manager.fullName);
                        }}
                      >
                        Düzenle
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Satış yöneticisi düzenle</DialogTitle>
                        <DialogDescription>Ad soyad bilgisi zorunludur.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Ad Soyad"
                          value={fullName}
                          onChange={(event) => setFullName(event.target.value)}
                        />
                        <Button onClick={submit}>Kaydet</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost">Sil</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Yönetici silindiğinde tüm hedef ve gerçekleşme kayıtları da silinir.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(manager.id)}>Sil</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button asChild variant="outline">
                    <Link href={`/targets?managerId=${manager.id}`}>Hedefler</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/actuals?managerId=${manager.id}`}>Gerçekleşmeler</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/dashboard?managerId=${manager.id}`}>Dashboard</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
