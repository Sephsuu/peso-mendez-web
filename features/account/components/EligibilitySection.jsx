"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useClaims } from "@/hooks/use-claims";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { UserService } from "@/services/user.service";
import { formatDateToWord } from "@/lib/helper";

import { BadgeCheck, Calendar, Clock, IdCard } from "lucide-react";

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

const ELIGIBILITY_SLOTS = 2;
const LICENSE_SLOTS = 2; // ✅ PRC License also 2

const trim = (v) => (v ?? "").trim();

function sortByIdAsc(list) {
  return [...(Array.isArray(list) ? list : [])].sort(
    (a, b) => (a?.id ?? 0) - (b?.id ?? 0)
  );
}

function toDateInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  if (d.getFullYear() <= 1900) return ""; // treat 1899 placeholder as empty
  return d.toISOString().split("T")[0];
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
  const fixed = new Array(count).fill(null).map(() => ({}));
  for (let i = 0; i < count; i++) fixed[i] = list[i] ?? {};
  return fixed;
}

/* ================= PAGE ================= */

export function EligibilityAndLicenseSection() {
  const [reload, setReload] = useState(false);
  const [open, setOpen] = useState(false);

  const { claims, loading: authLoading } = useClaims();
  const userId = claims?.id || claims?.userId;

  const { data: eligRaw, loading: eligLoading } = useFetchOne(
    UserService.getUserEligibility, // rename if needed
    [userId, reload],
    [userId]
  );

  const { data: licRaw, loading: licLoading } = useFetchOne(
    UserService.getUserProfLicense, // rename if needed
    [userId, reload],
    [userId]
  );

  const eligList = useMemo(() => sortByIdAsc(eligRaw), [eligRaw]);
  const licList = useMemo(() => sortByIdAsc(licRaw), [licRaw]);

  const eligSlots = useMemo(
    () => fixedSlots(eligList, ELIGIBILITY_SLOTS),
    [eligList]
  );

  const licSlots = useMemo(
    () => fixedSlots(licList, LICENSE_SLOTS),
    [licList]
  );

  const lastUpdated = useMemo(() => {
    const a = maxUpdatedDate(eligList);
    const b = maxUpdatedDate(licList);
    if (!a && !b) return null;
    if (a && !b) return a;
    if (!a && b) return b;
    return new Date(
      Math.max(new Date(a).getTime(), new Date(b).getTime())
    ).toISOString();
  }, [eligList, licList]);

  if (authLoading || eligLoading || licLoading) return <Loader />;

  const noElig = !eligRaw || (Array.isArray(eligRaw) && eligRaw.length === 0);
  const noLic = !licRaw || (Array.isArray(licRaw) && licRaw.length === 0);
  const noData = noElig && noLic;

  if (noData) {
    return (
      <div className="flex-center flex-col gap-2 w-full p-4 rounded-md bg-light shadow-sm m-2">
        <div className="font-semibold text-center">
          You don&apos;t have eligibilities and PRC licenses yet.
        </div>
        <Button onClick={() => setOpen(true)} className="bg-primary mx-auto">
          Fill up form
        </Button>

        <UpdateEligibilityAndLicenseDialog
          open={open}
          setOpen={setOpen}
          userId={userId}
          eligibilities={eligRaw}
          licenses={licRaw}
          setReload={setReload}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      {/* HEADER */}
      <div className="bg-linear-to-l from-[#73b9ff] to-[#0a6aff] text-white px-6 py-10 md:px-16 lg:px-24">
        <h1 className="text-3xl font-semibold">
          Eligibilities & PRC Licenses
        </h1>

        <div className="flex items-center gap-2 mt-3 text-sm opacity-90">
          <BadgeCheck size={16} />
          <span>Eligibilities: {ELIGIBILITY_SLOTS} (fixed)</span>
        </div>

        <div className="flex items-center gap-2 mt-1 text-sm opacity-90">
          <IdCard size={16} />
          <span>PRC Licenses: {LICENSE_SLOTS} (fixed)</span>
        </div>

        <div className="flex items-center gap-2 mt-1 text-sm opacity-90">
          <Clock size={16} />
          <span>
            Last Updated: {lastUpdated ? formatDateToWord(lastUpdated) : "—"}
          </span>
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
        {/* ELIGIBILITIES */}
        <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Eligibilities</h2>

          {eligSlots.map((item, idx) => (
            <div
              key={`elig-slot-${idx}`}
              className="rounded-lg border p-4 space-y-2"
            >
              <div className="font-semibold text-gray-800">
                Eligibility {idx + 1}
              </div>

              <InfoItem
                label="Eligibility"
                value={item.eligibility}
                icon={BadgeCheck}
              />
              <InfoItem
                label="Date Taken"
                value={item.date_taken ? formatDateToWord(item.date_taken) : "—"}
                icon={Calendar}
              />

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

        {/* PRC LICENSES */}
        <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">PRC Licenses</h2>

          {licSlots.map((item, idx) => (
            <div
              key={`lic-slot-${idx}`}
              className="rounded-lg border p-4 space-y-2"
            >
              <div className="font-semibold text-gray-800">
                PRC License {idx + 1}
              </div>

              <InfoItem label="License" value={item.license} icon={IdCard} />
              <InfoItem
                label="Valid Until"
                value={item.valid_until ? formatDateToWord(item.valid_until) : "—"}
                icon={Calendar}
              />

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
      </div>

      {/* SINGLE DIALOG */}
      <UpdateEligibilityAndLicenseDialog
        open={open}
        setOpen={setOpen}
        userId={userId}
        eligibilities={eligRaw}
        licenses={licRaw}
        setReload={setReload}
      />
    </div>
  );
}

/* ================= SINGLE DIALOG ================= */

function UpdateEligibilityAndLicenseDialog({
  open,
  setOpen,
  userId,
  eligibilities,
  licenses,
  setReload,
}) {
  const initialElig = useMemo(() => {
    const list = sortByIdAsc(eligibilities);
    return new Array(ELIGIBILITY_SLOTS).fill(null).map((_, i) => {
      const row = list[i];
      return {
        id: row?.id ?? null,
        user_id: row?.user_id ?? userId,
        eligibility: row?.eligibility ?? "",
        date_taken: toDateInputValue(row?.date_taken),
      };
    });
  }, [eligibilities, userId]);

  const initialLic = useMemo(() => {
    const list = sortByIdAsc(licenses);
    return new Array(LICENSE_SLOTS).fill(null).map((_, i) => {
      const row = list[i];
      return {
        id: row?.id ?? null,
        user_id: row?.user_id ?? userId,
        license: row?.license ?? "",
        valid_until: toDateInputValue(row?.valid_until),
      };
    });
  }, [licenses, userId]);

  const [eligForm, setEligForm] = useState(initialElig);
  const [licForm, setLicForm] = useState(initialLic);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setEligForm(initialElig);
    setLicForm(initialLic);
  }, [open, initialElig, initialLic]);

  function updateElig(index, key, value) {
    setEligForm((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  }

  function updateLic(index, key, value) {
    setLicForm((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  }

  const validation = useMemo(() => {
    for (let i = 0; i < ELIGIBILITY_SLOTS; i++) {
      if (!trim(eligForm[i]?.eligibility)) {
        return { ok: false, message: `Eligibility ${i + 1}: Eligibility is required.` };
      }
      if (!trim(eligForm[i]?.date_taken)) {
        return { ok: false, message: `Eligibility ${i + 1}: Date Taken is required.` };
      }
    }

    for (let i = 0; i < LICENSE_SLOTS; i++) {
      if (!trim(licForm[i]?.license)) {
        return { ok: false, message: `PRC License ${i + 1}: License is required.` };
      }
      if (!trim(licForm[i]?.valid_until)) {
        return { ok: false, message: `PRC License ${i + 1}: Valid Until is required.` };
      }
    }

    return { ok: true, message: "" };
  }, [eligForm, licForm]);

  async function ensureEligibilitiesExist() {
    const latestRaw = await UserService.getUserEligibility(userId);
    const latest = sortByIdAsc(latestRaw);

    if (latest.length >= ELIGIBILITY_SLOTS) return latest.slice(0, ELIGIBILITY_SLOTS);

    for (let i = latest.length; i < ELIGIBILITY_SLOTS; i++) {
      await UserService.createEligibility({
        userId,
        eligibility: trim(eligForm[i].eligibility),
        dateTaken: eligForm[i].date_taken,
      });
    }

    const afterRaw = await UserService.getUserEligibility(userId);
    const after = sortByIdAsc(afterRaw);

    if (after.length < ELIGIBILITY_SLOTS) throw new Error("Failed to create eligibility slots.");
    return after.slice(0, ELIGIBILITY_SLOTS);
  }

  async function ensureLicensesExist() {
    const latestRaw = await UserService.getUserProfLicense(userId);
    const latest = sortByIdAsc(latestRaw);

    if (latest.length >= LICENSE_SLOTS) return latest.slice(0, LICENSE_SLOTS);

    for (let i = latest.length; i < LICENSE_SLOTS; i++) {
      await UserService.createProfessionalLicense({
        userId,
        license: trim(licForm[i].license),
        valid_until: licForm[i].valid_until,
      });
    }

    const afterRaw = await UserService.getUserProfLicense(userId);
    const after = sortByIdAsc(afterRaw);

    if (after.length < LICENSE_SLOTS) throw new Error("Failed to create license slots.");
    return after.slice(0, LICENSE_SLOTS);
  }

  async function handleSubmit() {
    if (!validation.ok) {
      toast.error(validation.message);
      return;
    }

    try {
      setLoading(true);

      const eligRows = await ensureEligibilitiesExist();
      const licRows = await ensureLicensesExist();

      for (let i = 0; i < ELIGIBILITY_SLOTS; i++) {
        await UserService.updateUserEligibility({
          id: eligRows[i].id,
          user_id: userId,
          eligibility: trim(eligForm[i].eligibility),
          date_taken: eligForm[i].date_taken,
        });
      }

      for (let i = 0; i < LICENSE_SLOTS; i++) {
        await UserService.updateUserProfessionalLicense({
          id: licRows[i].id,
          user_id: userId,
          license: trim(licForm[i].license),
          valid_until: licForm[i].valid_until,
        });
      }

      toast.success("Eligibilities & PRC licenses saved!");
      if (setReload) setReload((prev) => !prev);
      setOpen(false);
    } catch (err) {
      toast.error(err?.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Eligibilities & PRC Licenses
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 py-4">
          {/* ELIGIBILITIES */}
          <div className="space-y-4">
            <div className="font-semibold text-gray-800 flex items-center gap-2">
              <BadgeCheck className="w-4 h-4" />
              Eligibilities
            </div>

            {eligForm.map((r, idx) => (
              <div
                key={`elig-form-${idx}`}
                className="rounded-xl border bg-white p-4 shadow-sm space-y-4"
              >
                <div className="font-semibold text-gray-800">
                  Eligibility {idx + 1}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputGroup
                    label="Eligibility *"
                    value={r.eligibility}
                    onChange={(e) => updateElig(idx, "eligibility", e.target.value)}
                  />
                  <InputGroup
                    label="Date Taken *"
                    type="date"
                    value={r.date_taken}
                    onChange={(e) => updateElig(idx, "date_taken", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* PRC LICENSES */}
          <div className="space-y-4">
            <div className="font-semibold text-gray-800 flex items-center gap-2">
              <IdCard className="w-4 h-4" />
              PRC Licenses
            </div>

            {licForm.map((r, idx) => (
              <div
                key={`lic-form-${idx}`}
                className="rounded-xl border bg-white p-4 shadow-sm space-y-4"
              >
                <div className="font-semibold text-gray-800">
                  PRC License {idx + 1}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputGroup
                    label="License *"
                    value={r.license}
                    onChange={(e) => updateLic(idx, "license", e.target.value)}
                  />
                  <InputGroup
                    label="Valid Until *"
                    type="date"
                    value={r.valid_until}
                    onChange={(e) => updateLic(idx, "valid_until", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
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
