"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useClaims } from "@/hooks/use-claims";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { UserService } from "@/services/user.service";
import { formatDateToWord } from "@/lib/helper";

import { Briefcase, Building2, MapPin, Calendar, Clock, BadgeCheck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/* ================= CONFIG ================= */

const SLOT_COUNT = 3;

const fields = [
  { key: "company_name", label: "Company Name", icon: Building2 },
  { key: "address", label: "Address", icon: MapPin },
  { key: "position", label: "Position", icon: Briefcase },
  { key: "no_of_month", label: "No. of Month(s)", icon: Calendar },
  { key: "status", label: "Status", icon: BadgeCheck }, // ex: Regular/Contractual/etc
];

const trim = (v) => (v ?? "").trim();

function sortByIdAsc(list) {
  return [...(Array.isArray(list) ? list : [])].sort(
    (a, b) => (a?.id ?? 0) - (b?.id ?? 0)
  );
}

function maxUpdatedDate(items) {
  const dates = (Array.isArray(items) ? items : [])
    .map((x) => x?.updated_at || x?.created_at)
    .filter(Boolean)
    .map((d) => new Date(d).getTime());

  if (dates.length === 0) return null;
  return new Date(Math.max(...dates)).toISOString();
}

function fixedSlots(items, count) {
  const list = sortByIdAsc(items);
  return new Array(count).fill(null).map((_, i) => list[i] ?? {});
}

/* ================= PAGE ================= */

export function WorkExperienceSection() {
  const [reload, setReload] = useState(false);
  const [open, setOpen] = useState(false);

  const { claims, loading: authLoading } = useClaims();
  const userId = claims?.id || claims?.userId;

  const { data: workRaw, loading } = useFetchOne(
    UserService.getUserWorkExperience, // ✅ rename if needed
    [userId, reload],
    [userId]
  );

  const workList = useMemo(() => sortByIdAsc(workRaw), [workRaw]);
  const slots = useMemo(() => fixedSlots(workList, SLOT_COUNT), [workList]);

  const lastUpdated = useMemo(() => maxUpdatedDate(workList), [workList]);

  if (authLoading || loading) return <Loader />;

  if (!workRaw || (Array.isArray(workRaw) && workRaw.length === 0)) {
    return (
      <div className="flex-center flex-col gap-2 w-full p-4 rounded-md bg-light shadow-sm m-2">
        <div className="font-semibold text-center">
          You don&apos;t have work experience yet.
        </div>
        <Button onClick={() => setOpen(true)} className="bg-primary mx-auto">
          Fill up form
        </Button>

        <UpdateWorkExperienceDialog
          open={open}
          setOpen={setOpen}
          userId={userId}
          experiences={workRaw}
          setReload={setReload}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      {/* HEADER */}
      <div className="bg-linear-to-l from-[#73b9ff] to-[#0a6aff] text-white px-6 py-10 md:px-16 lg:px-24">
        <h1 className="text-3xl font-semibold">Work Experience</h1>

        <div className="flex items-center gap-2 mt-3 text-sm opacity-90">
          <Briefcase size={16} />
          <span>Fixed Experiences: {SLOT_COUNT}</span>
        </div>

        <div className="flex items-center gap-2 mt-1 text-sm opacity-90">
          <Clock size={16} />
          <span>Last Updated: {lastUpdated ? formatDateToWord(lastUpdated) : "—"}</span>
        </div>

        {claims?.role !== "employer" && (
          <Button
            variant="secondary"
            className="mt-5 bg-light"
            onClick={() => setOpen(true)}
          >
            Edit Information
          </Button>
        )}
      </div>

      {/* DETAILS */}
      <div className="px-6 py-8 space-y-6">
        {slots.map((item, idx) => (
          <div
            key={`work-${idx}`}
            className="bg-white shadow-sm rounded-xl border p-5 space-y-4"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              Work Experience {idx + 1}
            </h2>

            <InfoItem label="Company Name" value={item.company_name} icon={Building2} />
            <InfoItem label="Address" value={item.address} icon={MapPin} />
            <InfoItem label="Position" value={item.position} icon={Briefcase} />
            <InfoItem label="No. of Month(s)" value={item.no_of_month} icon={Calendar} />
            <InfoItem label="Status" value={item.status} icon={BadgeCheck} />

            <div className="pt-2">
              <InfoItem
                label="Filled Up"
                value={item.created_at ? formatDateToWord(item.created_at) : "—"}
                icon={Calendar}
              />
              <InfoItem
                label="Last Updated"
                value={item.updated_at ? formatDateToWord(item.updated_at) : "—"}
                icon={Clock}
              />
            </div>
          </div>
        ))}
      </div>

      {/* SINGLE DIALOG */}
      <UpdateWorkExperienceDialog
        open={open}
        setOpen={setOpen}
        userId={userId}
        experiences={workRaw}
        setReload={setReload}
      />
    </div>
  );
}

/* ================= SINGLE DIALOG ================= */

function UpdateWorkExperienceDialog({ open, setOpen, userId, experiences, setReload }) {
  const initialForm = useMemo(() => {
    const list = sortByIdAsc(experiences);

    return new Array(SLOT_COUNT).fill(null).map((_, i) => {
      const row = list[i];
      return {
        id: row?.id ?? null,
        user_id: row?.user_id ?? userId,
        company_name: row?.company_name ?? "",
        address: row?.address ?? "",
        position: row?.position ?? "",
        no_of_month: row?.no_of_month ?? "",
        status: row?.status ?? "",
      };
    });
  }, [experiences, userId]);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  // ✅ ensures inputs show current values when opened
  useEffect(() => {
    if (!open) return;
    setForm(initialForm);
  }, [open, initialForm]);

  function updateRow(index, key, value) {
    setForm((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  }

  const validation = useMemo(() => {
    for (let i = 0; i < SLOT_COUNT; i++) {
      for (const f of fields) {
        if (!trim(form[i]?.[f.key])) {
          return { ok: false, message: `Work Experience ${i + 1}: ${f.label} is required.` };
        }
      }
    }
    return { ok: true, message: "" };
  }, [form]);

  async function ensureThreeExist() {
    const latestRaw = await UserService.getUserWorkExperience(userId);
    const latest = sortByIdAsc(latestRaw);

    if (latest.length >= SLOT_COUNT) return latest.slice(0, SLOT_COUNT);

    // Create missing rows (using current form values so required fields pass)
    for (let i = latest.length; i < SLOT_COUNT; i++) {
      await UserService.createWorkExperience({
        userId,
        companyName: trim(form[i].company_name),
        address: trim(form[i].address),
        position: trim(form[i].position),
        noOfMonth: trim(form[i].no_of_month),
        status: trim(form[i].status),
      });
    }

    const afterRaw = await UserService.getUserWorkExperience(userId);
    const after = sortByIdAsc(afterRaw);

    if (after.length < SLOT_COUNT) throw new Error("Failed to create 3 work experience slots.");
    return after.slice(0, SLOT_COUNT);
  }

  async function handleSubmit() {
    if (!validation.ok) {
      toast.error(validation.message);
      return;
    }

    try {
      setLoading(true);

      // Ensure DB has exactly 3 rows before updating
      const rows = await ensureThreeExist();

      for (let i = 0; i < SLOT_COUNT; i++) {
        await UserService.updateUserWorkExperience({
          id: rows[i].id,
          user_id: userId,
          company_name: trim(form[i].company_name),
          address: trim(form[i].address),
          position: trim(form[i].position),
          no_of_month: trim(form[i].no_of_month),
          status: trim(form[i].status),
        });
      }

      toast.success("Work experience saved!");
      if (setReload) setReload((prev) => !prev);
      setOpen(false);
    } catch (err) {
      toast.error(err?.message || "Failed to save work experience.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Work Experience
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {form.map((row, idx) => (
            <div
              key={`work-form-${idx}`}
              className="rounded-xl border bg-white p-4 shadow-sm space-y-4"
            >
              <div className="font-semibold text-gray-800">
                Work Experience {idx + 1}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((f) => (
                  <InputGroup
                    key={`${idx}-${f.key}`}
                    label={`${f.label} *`}
                    value={row[f.key]}
                    onChange={(e) => updateRow(idx, f.key, e.target.value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex justify-end">
          <Button
            disabled={loading || !validation.ok}
            onClick={handleSubmit}
            className="bg-primary text-white"
            title={!validation.ok ? validation.message : ""}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ================= REUSABLES ================= */

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b last:border-none">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <span className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-0 text-right">
        {value || "—"}
      </span>
    </div>
  );
}

function InputGroup({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        value={value}
        type={type}
        onChange={onChange}
        className="border-primary/30 focus-visible:ring-primary w-full"
      />
    </div>
  );
}
