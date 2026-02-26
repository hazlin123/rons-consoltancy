import React, { useState, useEffect } from "react";
import { kenyaGeography } from "@rons/utils";
import { MapPin, Info } from "@phosphor-icons/react";

interface LocationSelectorProps {
    onLocationChange: (location: {
        county: string;
        constituency: string;
        ward: string;
    }) => void;
    initialLocation?: {
        county: string;
        constituency: string;
        ward: string;
    };
    className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
    onLocationChange,
    initialLocation,
    className,
}) => {
    const [selectedCountyId, setSelectedCountyId] = useState<string>("");
    const [selectedConstituencyId, setSelectedConstituencyId] = useState<string>("");
    const [selectedWardId, setSelectedWardId] = useState<string>("");

    const [counties, setCounties] = useState<any[]>([]);
    const [constituencies, setConstituencies] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    useEffect(() => {
        setCounties(kenyaGeography.counties);
    }, []);

    // Handle initial location
    useEffect(() => {
        if (initialLocation && counties.length > 0) {
            const county = counties.find(c => c.name === initialLocation.county);
            if (county) {
                setSelectedCountyId(county.id.toString());
                const consts = county.constituencies || [];
                setConstituencies(consts);

                const constituency = consts.find((c: any) => c.name === initialLocation.constituency);
                if (constituency) {
                    setSelectedConstituencyId(constituency.id.toString());
                    const wds = constituency.wards || [];
                    setWards(wds);

                    const ward = wds.find((w: any) => w.name === initialLocation.ward);
                    if (ward) {
                        setSelectedWardId(ward.id.toString());
                    }
                }
            }
        }
    }, [initialLocation, counties]);

    const handleCountyChange = (countyId: string) => {
        setSelectedCountyId(countyId);
        setSelectedConstituencyId("");
        setSelectedWardId("");

        const county = counties.find((c: any) => c.id.toString() === countyId);
        setConstituencies(county ? county.constituencies : []);
        setWards([]);

        updateParent(countyId, "", "");
    };

    const handleConstituencyChange = (constituencyId: string) => {
        setSelectedConstituencyId(constituencyId);
        setSelectedWardId("");

        const constituency = constituencies.find(
            (c: any) => c.id.toString() === constituencyId
        );
        setWards(constituency ? constituency.wards : []);

        updateParent(selectedCountyId, constituencyId, "");
    };

    const handleWardChange = (wardId: string) => {
        setSelectedWardId(wardId);
        updateParent(selectedCountyId, selectedConstituencyId, wardId);
    };

    const updateParent = (countyId: string, constituencyId: string, wardId: string) => {
        const county = counties.find((c: any) => c.id.toString() === countyId);
        const constituency = constituencies.find(
            (c: any) => c.id.toString() === constituencyId
        );
        const ward = wards.find((w: any) => w.id.toString() === wardId);

        if (typeof onLocationChange === 'function') {
            onLocationChange({
                county: county?.name || "",
                constituency: constituency?.name || "",
                ward: ward?.name || "",
            });
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="modern-input-group">
                <label className="modern-label flex items-center gap-2">
                    <MapPin weight="duotone" className="w-3 h-3 text-primary" />
                    Target County *
                </label>
                <select
                    className="modern-select"
                    value={selectedCountyId}
                    onChange={(e) => handleCountyChange(e.target.value)}
                    required
                >
                    <option value="">-- Select County --</option>
                    {counties.map((county) => (
                        <option key={county.id} value={county.id.toString()} className="bg-[#15171e]">
                            {county.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="modern-input-group">
                <label className="modern-label flex items-center gap-2">
                    <MapPin weight="duotone" className="w-3 h-3 text-primary" />
                    Specific Constituency *
                </label>
                <select
                    className="modern-select disabled:opacity-30 disabled:cursor-not-allowed"
                    value={selectedConstituencyId}
                    onChange={(e) => handleConstituencyChange(e.target.value)}
                    disabled={!selectedCountyId}
                    required
                >
                    <option value="">-- Select Constituency --</option>
                    {constituencies.map((constituency) => (
                        <option key={constituency.id} value={constituency.id.toString()} className="bg-[#15171e]">
                            {constituency.name}
                        </option>
                    ))}
                </select>
                {!selectedCountyId && (
                    <p className="text-[10px] text-[#8a8d98] mt-2 flex items-center gap-2 italic">
                        <Info weight="duotone" className="w-3 h-3" />
                        Awaits county selection for dynamic routing
                    </p>
                )}
            </div>

            <div className="modern-input-group">
                <label className="modern-label flex items-center gap-2">
                    <MapPin weight="duotone" className="w-3 h-3 text-primary" />
                    Administrative Ward
                </label>
                <select
                    className="modern-select disabled:opacity-30 disabled:cursor-not-allowed"
                    value={selectedWardId}
                    onChange={(e) => handleWardChange(e.target.value)}
                    disabled={!selectedConstituencyId}
                >
                    <option value="">-- Select Ward (Optional) --</option>
                    {wards.map((ward) => (
                        <option key={ward.id} value={ward.id.toString()} className="bg-[#15171e]">
                            {ward.name}
                        </option>
                    ))}
                </select>
                {!selectedConstituencyId && (
                    <p className="text-[10px] text-[#8a8d98] mt-2 flex items-center gap-2 italic">
                        <Info weight="duotone" className="w-3 h-3" />
                        Awaits constituency selection for precise mapping
                    </p>
                )}
            </div>
        </div>
    );
};
