"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const isMale = (goose) => goose?.tags?.includes("male");
const isFemale = (goose) => goose?.tags?.includes("female");

const maleUidOf = (rule) => rule.male?.[0]?.uid;
const femaleUidOf = (rule) => rule.female?.[0]?.uid;

function offspringColsClass(count) {
  switch (count) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-3";
    default:
      return "grid-cols-2 sm:grid-cols-4";
  }
}

function validMatesFor(rules, sex, uid) {
  const getSelf = sex === "male" ? maleUidOf : femaleUidOf;
  const getMate = sex === "male" ? femaleUidOf : maleUidOf;
  return new Set(rules.filter((r) => getSelf(r) === uid).map(getMate));
}

function GooseSelect({ label, options, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative w-full max-w-xs" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex w-full items-center gap-3 border border-stone-gray bg-white px-4 py-3 text-left hover:border-heritage-navy"
      >
        {selected?.image?.url ? (
          <Image
            src={selected.image.url}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <span className="h-12 w-12 shrink-0 rounded-full border border-dashed border-stone-gray" />
        )}
        <span className="flex-1">
          <span className="block text-xs tracking-wide text-heritage-navy/60 uppercase">
            {label}
          </span>
          <span className="font-heading font-bold text-heritage-navy">
            {selected ? selected.title : `Select ${label}`}
          </span>
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-heritage-navy/60 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-full right-0 left-0 z-20 mt-2 max-h-72 overflow-y-auto border border-stone-gray bg-white shadow-lg"
        >
          <button
            type="button"
            role="option"
            aria-selected={!selected}
            onClick={() => {
              onSelect(null);
              setOpen(false);
            }}
            className={`flex w-full items-center gap-3 px-4 py-2 text-left italic hover:bg-warm-cream ${
              !selected ? "bg-warm-cream" : ""
            }`}
          >
            <span className="h-9 w-9 shrink-0 rounded-full border border-dashed border-stone-gray" />
            <span className="text-sm text-heritage-navy/60">None</span>
          </button>
          {options.length === 0 && (
            <p className="px-4 py-3 text-sm text-heritage-navy/60">No matching geese</p>
          )}
          {options.map((goose) => (
            <button
              key={goose.uid}
              type="button"
              role="option"
              aria-selected={selected?.uid === goose.uid}
              onClick={() => {
                onSelect(goose);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-warm-cream ${
                selected?.uid === goose.uid ? "bg-warm-cream" : ""
              }`}
            >
              {goose.image?.url && (
                <Image
                  src={goose.image.url}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
              )}
              <span className="text-sm text-heritage-navy">{goose.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ColorCalculator({ geese = [], rules = [] }) {
  const [selectedMale, setSelectedMale] = useState(null);
  const [selectedFemale, setSelectedFemale] = useState(null);

  const males = geese.filter(isMale);
  const females = geese.filter(isFemale);

  const maleOptions = selectedFemale
    ? males.filter((g) => validMatesFor(rules, "female", selectedFemale.uid).has(g.uid))
    : males;
  const femaleOptions = selectedMale
    ? females.filter((g) => validMatesFor(rules, "male", selectedMale.uid).has(g.uid))
    : females;

  const handleSelectMale = (goose) => {
    setSelectedMale(goose);
    if (goose && selectedFemale && !validMatesFor(rules, "male", goose.uid).has(selectedFemale.uid)) {
      setSelectedFemale(null);
    }
  };

  const handleSelectFemale = (goose) => {
    setSelectedFemale(goose);
    if (goose && selectedMale && !validMatesFor(rules, "female", goose.uid).has(selectedMale.uid)) {
      setSelectedMale(null);
    }
  };

  const matchedRule = rules.find(
    (r) => maleUidOf(r) === selectedMale?.uid && femaleUidOf(r) === selectedFemale?.uid,
  );
  const offspring = matchedRule?.products?.map((p) => p.child?.[0]).filter(Boolean) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="bg-white p-8">
        <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:items-start">
          <GooseSelect
            label="Male"
            options={maleOptions}
            selected={selectedMale}
            onSelect={handleSelectMale}
          />
          <GooseSelect
            label="Female"
            options={femaleOptions}
            selected={selectedFemale}
            onSelect={handleSelectFemale}
          />
        </div>

        {matchedRule?.rule_notes && (
          <p className="font-body mt-6 text-center text-sm text-heritage-navy/80 italic">
            {matchedRule.rule_notes}
          </p>
        )}

        {selectedMale && selectedFemale && (
          <div className="mt-10">
            {offspring.length > 0 ? (
              <div className={`mx-auto grid w-fit gap-8 ${offspringColsClass(offspring.length)}`}>
                {offspring.map((child) => (
                  <div key={child.uid} className="flex flex-col items-center text-center">
                    {child.image?.url && (
                      <Image
                        src={child.image.url}
                        alt={child.title}
                        width={160}
                        height={160}
                        className="h-40 w-40 object-contain"
                      />
                    )}
                    <span className="font-heading mt-3 font-bold text-heritage-navy uppercase">
                      {child.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-heritage-navy/60">
                No known offspring results for this pairing yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
