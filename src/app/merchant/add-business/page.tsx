'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Upload, Clock, Truck, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { queryClient } from '@/lib/query-client';
import type { Category, District, Mandal, Village, User } from '@/types';

// Category-specific label overrides
const BUSINESS_NAME_LABELS: Record<string, string> = {
  Healthcare: 'Clinic / Hospital Name',
  Pharmacy: 'Pharmacy Name',
  Education: 'School / Institution Name',
  Restaurant: 'Restaurant / Hotel Name',
};

const OWNER_NAME_LABELS: Record<string, string> = {
  Healthcare: "Doctor's Name",
  Pharmacy: "Pharmacist's Name",
  Education: "Principal's Name",
};

export default function AddBusinessPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u?.districtId) setDistrictId(String(u.districtId));
    if (u?.mandalId) setMandalId(String(u.mandalId));
    if (u?.villageId) setVillageId(String(u.villageId));
  }, []);

  // Form state
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [mandalId, setMandalId] = useState('');
  const [villageId, setVillageId] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('21:00');
  const [is24Hours, setIs24Hours] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  // Data fetching
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.categories() as Promise<Category[]>,
  });

  const { data: districts = [] } = useQuery<District[]>({
    queryKey: ['districts'],
    queryFn: () => api.districts() as Promise<District[]>,
  });

  const { data: mandals = [] } = useQuery<Mandal[]>({
    queryKey: ['mandals', districtId],
    queryFn: () => api.mandals(Number(districtId)) as Promise<Mandal[]>,
    enabled: !!districtId,
  });

  const { data: villages = [] } = useQuery<Village[]>({
    queryKey: ['villages', mandalId],
    queryFn: () => api.villages(Number(mandalId)) as Promise<Village[]>,
    enabled: !!mandalId,
  });

  const mutation = useMutation({
    mutationFn: (data: unknown) => api.createBusiness(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBusinesses'] });
      router.push('/merchant/dashboard');
    },
    onError: (err) => {
      setServerError((err as Error).message || 'Failed to create business');
    },
  });

  const selectedCategory = categories.find((c) => c.id === Number(categoryId));
  const businessNameLabel = selectedCategory
    ? BUSINESS_NAME_LABELS[selectedCategory.name] || 'Business Name'
    : 'Business Name';
  const ownerNameLabel = selectedCategory
    ? OWNER_NAME_LABELS[selectedCategory.name] || 'Owner Name'
    : 'Owner Name';

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!categoryId) errs.category = 'Please select a category';
    if (!name.trim()) errs.name = 'Business name is required';
    if (!phone || phone.length < 10) errs.phone = 'Enter a valid phone number';
    if (!districtId) errs.district = 'Please select a district';
    if (!mandalId) errs.mandal = 'Please select a mandal';
    if (!villageId) errs.village = 'Please select a village';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    mutation.mutate({
      categoryId: Number(categoryId),
      name,
      ownerName: ownerName || undefined,
      phone,
      whatsapp: whatsapp || undefined,
      districtId: Number(districtId),
      mandalId: Number(mandalId),
      villageId: Number(villageId),
      address: address || undefined,
      description: description || undefined,
      openTime: is24Hours ? undefined : openTime,
      closeTime: is24Hours ? undefined : closeTime,
      is24Hours,
      hasDelivery,
    });
  }

  return (
    <div className="min-h-dvh bg-white">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-6"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E7B3B 100%)' }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-white/70 text-sm mb-4 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="text-xl font-bold text-white">Add Business</h1>
        <p className="text-white/60 text-sm mt-1">List your business on Local Connect</p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-5">
        {/* Category */}
        <Select
          label="Business Category *"
          placeholder="Select Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={categories.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
          error={errors.category}
        />

        {/* Business Name */}
        <Input
          label={`${businessNameLabel} *`}
          placeholder={`Enter ${businessNameLabel.toLowerCase()}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        {/* Owner/Doctor Name */}
        <Input
          label={ownerNameLabel}
          placeholder={`Enter ${ownerNameLabel.toLowerCase()}`}
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
        />

        {/* Contact */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Phone *"
            type="tel"
            placeholder="10-digit number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            error={errors.phone}
            inputMode="numeric"
          />
          <Input
            label="WhatsApp"
            type="tel"
            placeholder="WhatsApp number"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
            inputMode="numeric"
          />
        </div>

        {/* Location */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Business Location</p>

          <Select
            label="District *"
            placeholder="Select District"
            value={districtId}
            onChange={(e) => {
              setDistrictId(e.target.value);
              setMandalId('');
              setVillageId('');
            }}
            options={districts.map((d) => ({ value: d.id, label: d.name }))}
            error={errors.district}
          />

          <Select
            label="Mandal *"
            placeholder={districtId ? 'Select Mandal' : 'Select district first'}
            value={mandalId}
            onChange={(e) => {
              setMandalId(e.target.value);
              setVillageId('');
            }}
            options={mandals.map((m) => ({ value: m.id, label: m.name }))}
            disabled={!districtId}
            error={errors.mandal}
          />

          <Select
            label="Village / Town *"
            placeholder={mandalId ? 'Select Village' : 'Select mandal first'}
            value={villageId}
            onChange={(e) => setVillageId(e.target.value)}
            options={villages.map((v) => ({ value: v.id, label: v.name }))}
            disabled={!mandalId}
            error={errors.village}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Address / Landmark
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address or nearby landmark"
            rows={2}
            className="w-full bg-white border border-gray-200 rounded-[12px] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell customers about your business..."
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-[12px] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Timing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock size={15} className="text-primary" />
              Business Hours
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={is24Hours}
                onChange={(e) => setIs24Hours(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-10 h-5 rounded-full transition-colors ${is24Hours ? 'bg-primary' : 'bg-gray-200'} relative`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${is24Hours ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-xs text-gray-600">24 Hours</span>
            </label>
          </div>

          {!is24Hours && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Opens at"
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
              />
              <Input
                label="Closes at"
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Delivery */}
        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-[12px] cursor-pointer">
          <div
            className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center transition-colors ${
              hasDelivery ? 'bg-primary border-primary' : 'border-gray-300'
            }`}
            onClick={() => setHasDelivery(!hasDelivery)}
          >
            {hasDelivery && <CheckSquare size={12} className="text-white" />}
          </div>
          <div className="flex items-center gap-2">
            <Truck size={16} className={hasDelivery ? 'text-primary' : 'text-gray-400'} />
            <span className="text-sm font-medium text-gray-700">Delivery Available</span>
          </div>
        </label>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Business Photo
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-[16px] p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
            <Upload size={28} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Tap to upload a photo</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5 MB</p>
          </div>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] p-3">
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          loading={mutation.isPending}
          className="w-full"
        >
          List My Business
        </Button>

        <div className="h-6" />
      </form>
    </div>
  );
}
