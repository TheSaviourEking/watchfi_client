import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select as ShadcnSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { toast } from "sonner";
import Select from "react-select";
import api from "../../../../config/apiConfig";

const API_BASE_URL = api.baseURL;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const DEFAULT_SPECIFICATION_CATEGORIES = [
    { value: "Case", label: "Case" },
    { value: "Movement", label: "Movement" },
    { value: "Dial", label: "Dial" },
    { value: "Bracelet", label: "Bracelet" },
    { value: "Functions", label: "Functions" },
    { value: "Warranty", label: "Warranty" },
    { value: "Other", label: "Other" },
];

const SpecificationOptionSchema = z.object({
    id: z.string().optional(),
    label: z.string().min(1, { message: "Label is required" }).max(255, { message: "Label must be at most 255 characters" }),
    value: z.string().min(1, { message: "Value is required" }).max(500, { message: "Value must be at most 500 characters" }),
});

const SpecificationSchema = z.object({
    id: z.string().optional(),
    heading: z.string().min(1, { message: "Heading is required" }).max(255, { message: "Heading must be at most 255 characters" }),
    description: z.string().max(255, { message: "Description must be at most 255 characters" }).optional(),
    specificationOptions: z
        .array(SpecificationOptionSchema)
        .min(1, { message: "At least one option is required" }),
});

const PhotoSchema = z.object({
    id: z.string().optional(),
    photoUrl: z.string().url().optional().or(z.literal("")).or(z.undefined()),
    altText: z.string().max(255, { message: "Alt text must be at most 255 characters" }).optional(),
    order: z.number().int().min(0, { message: "Order must be a non-negative integer" }),
});

const createFormSchema = (isEdit) =>
    z.object({
        name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(255, { message: "Name must be at most 255 characters" }),
        referenceCode: z.string().min(2, { message: "Reference code must be at least 2 characters" }).max(255, { message: "Reference code must be at most 255 characters" }),
        description: z.string().min(1, { message: "Description is required" }).max(255, { message: "Description must be at most 255 characters" }),
        detail: z.string().optional(),
        price: z.coerce.number().min(0, { message: "Price must be a positive number" }).max(99999999.99, { message: "Price is too large" }),
        stockQuantity: z.coerce.number().int().min(0, { message: "Stock quantity must be a non-negative integer" }),
        isAvailable: z.boolean(),
        deletedAt: z.date().optional().nullable(),
        brandId: z.string().min(1, { message: "Please select a brand" }),
        newBrand: z.string().max(255, { message: "Brand name must be at most 255 characters" }).optional(),
        newBrandDescription: z.string().max(255, { message: "Brand description must be at most 255 characters" }).optional(),
        logoInputType: z.enum(["file", "url"]).optional(),
        newBrandLogoFile: z.any().optional(),
        newBrandLogoUrl: z.string().url().optional().or(z.literal("")),
        colors: z.array(z.string()).optional(),
        newColors: z.array(z.string().max(100, { message: "Color name must be at most 100 characters" })).optional(),
        categories: z.array(z.string()).optional(),
        newCategories: z.array(z.string().max(100, { message: "Category name must be at most 100 characters" })).optional(),
        concepts: z.array(z.string()).optional(),
        newConcepts: z.array(z.string().max(100, { message: "Concept name must be at most 100 characters" })).optional(),
        materials: z.array(z.string()).optional(),
        newMaterials: z.array(z.string().max(100, { message: "Material name must be at most 100 characters" })).optional(),
        specifications: isEdit
            ? z.array(SpecificationSchema).optional()
            : z.array(SpecificationSchema).min(1, { message: "At least one specification is required" }),
        primaryPhoto: isEdit
            ? z.any().optional()
            : z.any()
                .refine(
                    (files) => files && "length" in files && files.length > 0,
                    { message: "Primary photo is required" }
                )
                .refine(
                    (files) =>
                        files &&
                        "length" in files &&
                        Array.from(files).every(
                            (file) => file && "type" in file && ACCEPTED_IMAGE_TYPES.includes(file.type)
                        ),
                    { message: "Only .jpg, .jpeg, .png, .webp files are allowed" }
                )
                .refine(
                    (files) =>
                        files &&
                        "length" in files &&
                        Array.from(files).every(
                            (file) => file && "size" in file && file.size <= MAX_FILE_SIZE
                        ),
                    { message: "Each file must be less than 5MB" }
                ),
        primaryPhotoAltText: z.string().max(255, { message: "Primary photo alt text must be at most 255 characters" }).optional(),
        secondaryPhotos: z.any()
            .optional()
            .refine(
                (files) =>
                    !files ||
                    (files &&
                        "length" in files &&
                        Array.from(files).every(
                            (file) => file && "type" in file && ACCEPTED_IMAGE_TYPES.includes(file.type)
                        )),
                { message: "Only .jpg, .jpeg, .png, .webp files are allowed" }
            )
            .refine(
                (files) =>
                    !files ||
                    (files &&
                        "length" in files &&
                        Array.from(files).every(
                            (file) => file && "size" in file && file.size <= MAX_FILE_SIZE
                        )),
                { message: "Each file must be less than 5MB" }
            ),
        secondaryPhotosData: z.array(PhotoSchema).optional(),
        existingPrimaryUrl: z.string().url().optional().or(z.literal("")),
        existingSecondaryUrls: z.array(PhotoSchema).optional(),
        removedImages: z.object({
            primary: z.boolean(),
            secondary: z.array(z.string().url()).refine(
                (urls) => new Set(urls).size === urls.length,
                { message: "Removed secondary URLs must be unique" }
            ),
        }),
    })
        .refine(
            (data) => {
                if (data.brandId === "other" && (!data.newBrand || data.newBrand.trim() === "")) {
                    return false;
                }
                return true;
            },
            { message: "New brand name is required when 'Other' is selected", path: ["newBrand"] }
        )
        .refine(
            (data) => {
                if (data.brandId === "other" && !data.logoInputType) {
                    return false;
                }
                return true;
            },
            { message: "Please select a logo input type when 'Other' is selected", path: ["logoInputType"] }
        )
        .refine(
            (data) => {
                if (
                    data.brandId === "other" &&
                    data.logoInputType === "file" &&
                    (!data.newBrandLogoFile || !("length" in data.newBrandLogoFile) || data.newBrandLogoFile.length === 0)
                ) {
                    return false;
                }
                return true;
            },
            { message: "A logo file is required when 'Upload Logo File' is selected", path: ["newBrandLogoFile"] }
        )
        .refine(
            (data) => {
                if (
                    data.brandId === "other" &&
                    data.logoInputType === "file" &&
                    data.newBrandLogoFile &&
                    "length" in data.newBrandLogoFile
                ) {
                    return Array.from(data.newBrandLogoFile).every(
                        (file) => file && "type" in file && ACCEPTED_IMAGE_TYPES.includes(file.type)
                    );
                }
                return true;
            },
            { message: "Only .jpg, .jpeg, .png, .webp files are allowed", path: ["newBrandLogoFile"] }
        )
        .refine(
            (data) => {
                if (
                    data.brandId === "other" &&
                    data.logoInputType === "file" &&
                    data.newBrandLogoFile &&
                    "length" in data.newBrandLogoFile
                ) {
                    return Array.from(data.newBrandLogoFile).every(
                        (file) => file && "size" in file && file.size <= MAX_FILE_SIZE
                    );
                }
                return true;
            },
            { message: "File must be less than 5MB", path: ["newBrandLogoFile"] }
        )
        .refine(
            (data) => {
                if (
                    data.brandId === "other" &&
                    data.logoInputType === "url" &&
                    (!data.newBrandLogoUrl || !z.string().url().safeParse(data.newBrandLogoUrl).success)
                ) {
                    return false;
                }
                return true;
            },
            { message: "A valid URL is required when 'Enter Logo URL' is selected", path: ["newBrandLogoUrl"] }
        );

function FileField({
    label,
    name,
    register,
    error,
    watch,
    setValue,
    multiple = false,
    accept,
    existingUrls = [],
    onRemoveExisting,
    isEdit = false,
    altTextName,
    orderName,
    onUpdatePhotoData,
}) {
    const fileInputRef = useRef(null);
    const files = watch(name);
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        console.log(`FileField (${name}): files=`, files);
        if (typeof window === "undefined" || !files || !("length" in files)) {
            setPreviews([]);
            return;
        }
        const fileArray = Array.from(files);
        const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
        setPreviews(newPreviews);
        return () => {
            newPreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [files, name]);

    const handleFileChange = (event) => {
        const newFiles = event.target.files;
        console.log(`FileField (${name}): New files selected:`, newFiles);
        if (newFiles && newFiles.length > 0) {
            if (multiple) {
                const existingFiles = files && "length" in files ? Array.from(files) : [];
                const newFilesArray = Array.from(newFiles);
                const dt = new DataTransfer();
                existingFiles.forEach((file) => dt.items.add(file));
                newFilesArray.forEach((file) => dt.items.add(file));
                setValue(name, dt.files);
                if (orderName) {
                    const currentData = watch(orderName) || [];
                    const newData = newFilesArray.map((_, index) => ({
                        photoUrl: undefined,
                        altText: "",
                        order: currentData.length + index,
                    }));
                    setValue(orderName, [...currentData, ...newData]);
                    console.log(`FileField (${name}): Updated ${orderName}:`, [...currentData, ...newData]);
                }
            } else {
                setValue(name, newFiles);
                if (altTextName) {
                    setValue(altTextName, "");
                }
            }
        } else {
            console.log(`FileField (${name}): No files selected, keeping current value`);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveImage = (index) => {
        if (!files || !("length" in files)) return;
        const fileArray = Array.from(files);
        const updatedFiles = fileArray.filter((_, i) => i !== index);
        const dt = new DataTransfer();
        updatedFiles.forEach((file) => dt.items.add(file));
        setValue(name, dt.files);
        console.log(`FileField (${name}): Removed file at index ${index}, new files:`, dt.files);
        if (orderName) {
            const currentData = watch(orderName) || [];
            setValue(orderName, currentData.filter((_, i) => i !== index));
            console.log(`FileField (${name}): Updated ${orderName} after removal:`, currentData.filter((_, i) => i !== index));
        }
    };

    const handleClearAll = () => {
        setValue(name, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        if (orderName) {
            setValue(orderName, []);
            console.log(`FileField (${name}): Cleared all files and ${orderName}`);
        }
    };

    return (
        <div className="grid gap-3">
            <div className="flex items-center justify-between">
                <Label htmlFor={name}>
                    {label} {isEdit && existingUrls.length === 0 && !files?.length && "(Optional)"}
                </Label>
                {multiple && (files?.length || 0) > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearAll}
                        className="text-red-600 hover:text-red-700"
                    >
                        Clear All
                    </Button>
                )}
            </div>
            <Input
                ref={fileInputRef}
                id={name}
                name={name}
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={handleFileChange}
                aria-describedby={`${name}-error`}
            />
            {multiple && (
                <p className="text-xs text-muted-foreground">
                    {files?.length || 0} file(s) selected. You can select more files to add them to your selection.
                </p>
            )}
            {(previews.length > 0 || existingUrls.length > 0) && (
                <div className={`grid gap-2 mt-2 ${multiple ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"}`}>
                    {existingUrls.map((photo, index) => (
                        <div key={`existing-${photo.id || photo.photoUrl}`} className="relative group">
                            <img
                                src={photo.photoUrl}
                                alt={photo.altText || `Existing ${label} ${index + 1}`}
                                className="w-full h-24 object-cover rounded border"
                            />
                            {onRemoveExisting && (
                                <button
                                    type="button"
                                    onClick={() => onRemoveExisting(photo.photoUrl)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    aria-label={`Remove existing ${label} ${index + 1}`}
                                >
                                    ×
                                </button>
                            )}
                            {multiple && onUpdatePhotoData && (
                                <div className="mt-2 space-y-1">
                                    <Input
                                        value={photo.altText || ""}
                                        onChange={(e) => onUpdatePhotoData(index, "altText", e.target.value)}
                                        placeholder="Alt text"
                                        className="text-xs"
                                        id={`existing-photo-${index}-altText`}
                                    />
                                    <Input
                                        type="number"
                                        value={photo.order}
                                        onChange={(e) => onUpdatePhotoData(index, "order", parseInt(e.target.value))}
                                        placeholder="Order"
                                        className="text-xs"
                                        id={`existing-photo-${index}-order`}
                                    />
                                </div>
                            )}
                            <p className="text-xs text-blue-600 mt-1">Existing image</p>
                        </div>
                    ))}
                    {previews.map((url, index) => (
                        <div key={`preview-${index}`} className="relative group">
                            <img
                                src={url}
                                alt={`Preview ${label} ${index + 1}`}
                                className="w-full h-24 object-cover rounded border"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                aria-label={`Remove new ${label} ${index + 1}`}
                            >
                                ×
                            </button>
                            {multiple && onUpdatePhotoData && (
                                <div className="mt-2 space-y-1">
                                    <Input
                                        value={(watch(orderName) || [])[index]?.altText || ""}
                                        onChange={(e) => onUpdatePhotoData(index, "altText", e.target.value)}
                                        placeholder="Alt text"
                                        className="text-xs"
                                        id={`new-photo-${index}-altText`}
                                    />
                                    <Input
                                        type="number"
                                        value={(watch(orderName) || [])[index]?.order || index}
                                        onChange={(e) => onUpdatePhotoData(index, "order", parseInt(e.target.value))}
                                        placeholder="Order"
                                        className="text-xs"
                                        id={`new-photo-${index}-order`}
                                    />
                                </div>
                            )}
                            <p className="text-xs text-green-600 mt-1 truncate">
                                New: {files?.item(index)?.name}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            {!multiple && altTextName && (
                <TextField
                    name={altTextName}
                    label="Primary Photo Alt Text"
                    placeholder="Enter alt text for primary photo"
                    register={register}
                    error={error?.[altTextName]}
                />
            )}
            {error && (
                <p id={`${name}-error`} className="text-red-500 text-sm">
                    {error.message}
                </p>
            )}
        </div>
    );
}

function TextField({
    label,
    name,
    register,
    error,
    placeholder,
    as: Component = Input,
    type = "text",
}) {
    return (
        <div className="grid gap-3">
            <Label htmlFor={name}>{label}</Label>
            <Component
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                {...register(name)}
                aria-describedby={`${name}-error`}
            />
            {error && (
                <p id={`${name}-error`} className="text-red-500 text-sm">
                    {error.message}
                </p>
            )}
        </div>
    );
}

function SelectField({
    label,
    name,
    error,
    watch,
    setValue,
    options,
    placeholder,
}) {
    return (
        <div className="grid gap-3">
            <Label htmlFor={name}>{label}</Label>
            <ShadcnSelect
                value={watch(name) || ""}
                onValueChange={(value) => setValue(name, value)}
            >
                <SelectTrigger aria-label={`Select ${label}`}>
                    <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                                {option.logoUrl && (
                                    <img
                                        src={option.logoUrl}
                                        alt={`${option.label} logo`}
                                        className="w-6 h-6 mr-2 object-contain"
                                    />
                                )}
                                <div>
                                    <span>{option.label}</span>
                                    {option.description && (
                                        <p className="text-xs text-muted-foreground truncate max-w-xs">
                                            {option.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </ShadcnSelect>
            {error && (
                <p id={`${name}-error`} className="text-red-500 text-sm">
                    {error.message}
                </p>
            )}
        </div>
    );
}

function MultiSelectField({
    label,
    name,
    newName,
    error,
    watch,
    setValue,
    options,
    placeholder,
    createAction,
}) {
    const [isCreating, setIsCreating] = useState(false);
    const [newOption, setNewOption] = useState("");

    const handleCreate = async () => {
        if (!newOption.trim()) return;
        setIsCreating(true);
        try {
            const result = await createAction(newOption.trim());
            setValue(name, [...(watch(name) || []), result.id]);
            setValue(newName, [...(watch(newName) || []), result.name]);
            setNewOption("");
            toast.success(`${label} "${result.name}" created successfully.`);
        } catch (error) {
            toast.error(`Failed to create ${label.toLowerCase()}: ${error.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="grid gap-3">
            <Label>{label}</Label>
            <Select
                isMulti
                options={options}
                value={options.filter((option) => (watch(name) || []).includes(option.value))}
                onChange={(selected) => {
                    setValue(name, selected.map((opt) => opt.value));
                }}
                placeholder={placeholder || `Select ${label.toLowerCase()}`}
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={() => `No ${label.toLowerCase()} available`}
            />
            <div className="flex gap-2">
                <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder={`Enter new ${label.toLowerCase()} name`}
                    disabled={isCreating}
                />
                <Button
                    type="button"
                    onClick={handleCreate}
                    disabled={isCreating || !newOption.trim()}
                    size="sm"
                >
                    {isCreating ? "Creating..." : `Add ${label}`}
                </Button>
            </div>
            {error && (
                <p id={`${name}-error`} className="text-red-500 text-sm">
                    {error.message}
                </p>
            )}
        </div>
    );
}

function SpecificationsField({
    specifications,
    onUpdate,
    errors,
    categories = DEFAULT_SPECIFICATION_CATEGORIES,
    isEdit,
}) {
    const addSpecification = () => {
        onUpdate([
            ...specifications,
            { heading: "", description: "", specificationOptions: [{ label: "", value: "" }] },
        ]);
    };

    const removeSpecification = (index) => {
        onUpdate(specifications.filter((_, i) => i !== index));
    };

    const updateSpecification = (index, field, value) => {
        const updated = [...specifications];
        updated[index] = { ...updated[index], [field]: value };
        onUpdate(updated);
    };

    const addOption = (specIndex) => {
        const updated = [...specifications];
        updated[specIndex].specificationOptions.push({ label: "", value: "" });
        onUpdate(updated);
    };

    const removeOption = (specIndex, optionIndex) => {
        const updated = [...specifications];
        updated[specIndex].specificationOptions = updated[specIndex].specificationOptions.filter(
            (_, i) => i !== optionIndex
        );
        onUpdate(updated);
    };

    const updateOption = (specIndex, optionIndex, field, value) => {
        const updated = [...specifications];
        updated[specIndex].specificationOptions[optionIndex] = {
            ...updated[specIndex].specificationOptions[optionIndex],
            [field]: value,
        };
        onUpdate(updated);
    };

    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between">
                <Label>Specifications {isEdit ? "(Optional)" : "(At least one required)"}</Label>
                <Button
                    type="button"
                    onClick={addSpecification}
                    variant="outline"
                    size="sm"
                    aria-label="Add specification"
                >
                    Add Specification
                </Button>
            </div>
            {!isEdit && errors && (
                <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">
                    {errors.message || "Please add at least one specification before submitting."}
                </p>
            )}
            {specifications.map((spec, specIndex) => (
                <div key={spec.id || specIndex} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Specification {specIndex + 1}</h4>
                        <Button
                            type="button"
                            onClick={() => removeSpecification(specIndex)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            aria-label={`Remove specification ${specIndex + 1}`}
                        >
                            Remove
                        </Button>
                    </div>
                    <ShadcnSelect
                        value={spec.heading || ""}
                        onValueChange={(value) => updateSpecification(specIndex, "heading", value)}
                    >
                        <SelectTrigger aria-label={`Select heading for specification ${specIndex + 1}`}>
                            <SelectValue placeholder="Select heading" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </ShadcnSelect>
                    {errors?.[specIndex]?.heading && (
                        <p className="text-red-500 text-sm">{errors[specIndex].heading.message}</p>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor={`spec-${specIndex}-description`}>Description (Optional)</Label>
                        <Textarea
                            id={`spec-${specIndex}-description`}
                            value={spec.description || ""}
                            onChange={(e) => updateSpecification(specIndex, "description", e.target.value)}
                            placeholder="Detailed description of this specification..."
                            aria-describedby={`spec-${specIndex}-description-error`}
                        />
                        {errors?.[specIndex]?.description && (
                            <p id={`spec-${specIndex}-description-error`} className="text-red-500 text-sm">
                                {errors[specIndex].description.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Specification Options</Label>
                            <Button
                                type="button"
                                onClick={() => addOption(specIndex)}
                                variant="outline"
                                size="sm"
                                aria-label={`Add option to specification ${specIndex + 1}`}
                            >
                                Add Option
                            </Button>
                        </div>
                        {spec.specificationOptions.map((option, optionIndex) => (
                            <div key={option.id || optionIndex} className="flex gap-2">
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    <Input
                                        value={option.label || ""}
                                        onChange={(e) => updateOption(specIndex, optionIndex, "label", e.target.value)}
                                        placeholder="Label (e.g., Size)"
                                        id={`spec-${specIndex}-option-${optionIndex}-label`}
                                        aria-label={`Option ${optionIndex + 1} label for specification ${specIndex + 1}`}
                                    />
                                    <Input
                                        value={option.value || ""}
                                        onChange={(e) => updateOption(specIndex, optionIndex, "value", e.target.value)}
                                        placeholder="Value (e.g., 42 mm)"
                                        id={`spec-${specIndex}-option-${optionIndex}-value`}
                                        aria-label={`Option ${optionIndex + 1} value for specification ${specIndex + 1}`}
                                    />
                                </div>
                                {spec.specificationOptions.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeOption(specIndex, optionIndex)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                        aria-label={`Remove option ${optionIndex + 1}`}
                                    >
                                        ×
                                    </Button>
                                )}
                            </div>
                        ))}
                        {errors?.[specIndex]?.specificationOptions?.message && (
                            <p className="text-red-500 text-sm">{errors[specIndex].specificationOptions.message}</p>
                        )}
                    </div>
                </div>
            ))}
            {specifications.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                    No specifications added yet. Click "Add Specification" to get started.
                </div>
            )}
        </div>
    );
}

export default function WatchForm({
    watchData = null,
    onSubmit,
    onCancel,
    specificationCategories = DEFAULT_SPECIFICATION_CATEGORIES,
}) {
    const isEdit = !!watchData;
    const FormSchema = createFormSchema(isEdit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [brandOptions, setBrandOptions] = useState([{ value: "other", label: "Other" }]);
    const [colorOptions, setColorOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [conceptOptions, setConceptOptions] = useState([]);
    const [materialOptions, setMaterialOptions] = useState([]);
    const [isLoadingBrands, setIsLoadingBrands] = useState(true);
    const [isLoadingRelations, setIsLoadingRelations] = useState(true);
    const [existingPrimaryUrl, setExistingPrimaryUrl] = useState([]);
    const [existingSecondaryUrls, setExistingSecondaryUrls] = useState([]);
    const [specifications, setSpecifications] = useState([]);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            referenceCode: "",
            description: "",
            detail: "",
            price: 0,
            stockQuantity: 0,
            isAvailable: true,
            deletedAt: null,
            brandId: "",
            newBrand: "",
            newBrandDescription: "",
            logoInputType: undefined,
            newBrandLogoFile: null,
            newBrandLogoUrl: "",
            colors: [],
            newColors: [],
            categories: [],
            newCategories: [],
            concepts: [],
            newConcepts: [],
            materials: [],
            newMaterials: [],
            specifications: [],
            primaryPhoto: null,
            primaryPhotoAltText: "",
            secondaryPhotos: null,
            secondaryPhotosData: [],
            existingPrimaryUrl: "",
            existingSecondaryUrls: [],
            removedImages: { primary: false, secondary: [] },
        },
    });

    const { watch, setValue, handleSubmit, register, formState: { errors }, reset } = form;
    const selectedBrand = watch("brandId") || "";
    const logoInputType = watch("logoInputType");

    useEffect(() => {
        async function fetchRelations() {
            try {
                setIsLoadingBrands(true);
                setIsLoadingRelations(true);
                console.log("Fetching relations from API...");
                const [brandsRes, colorsRes, categoriesRes, conceptsRes, materialsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/v1/brands`),
                    fetch(`${API_BASE_URL}/api/v1/colors`),
                    fetch(`${API_BASE_URL}/api/v1/categories`),
                    fetch(`${API_BASE_URL}/api/v1/concepts`),
                    fetch(`${API_BASE_URL}/api/v1/materials`),
                ]);

                if (!brandsRes.ok || !colorsRes.ok || !categoriesRes.ok || !conceptsRes.ok || !materialsRes.ok) {
                    throw new Error(`Failed to fetch data: ${[brandsRes.status, colorsRes.status, categoriesRes.status, conceptsRes.status, materialsRes.status].join(", ")}`);
                }

                const [brands, colors, categories, concepts, materials] = await Promise.all([
                    brandsRes.json(),
                    colorsRes.json(),
                    categoriesRes.json(),
                    conceptsRes.json(),
                    materialsRes.json(),
                ]);

                console.log("Fetched relations:", { brands, colors, categories, concepts, materials });

                setBrandOptions([
                    ...brands.map((brand) => ({
                        value: brand.id,
                        label: brand.name,
                        logoUrl: brand.logoUrl,
                        description: brand.description,
                    })),
                    { value: "other", label: "Other" },
                ]);
                setColorOptions(
                    colors.map((color) => ({
                        value: color.id,
                        label: color.name,
                    }))
                );
                setCategoryOptions(
                    categories.map((category) => ({
                        value: category.id,
                        label: category.name,
                    }))
                );
                setConceptOptions(
                    concepts.map((concept) => ({
                        value: concept.id,
                        label: concept.name,
                    }))
                );
                setMaterialOptions(
                    materials.map((material) => ({
                        value: material.id,
                        label: material.name,
                    }))
                );
            } catch (error) {
                console.error("Error fetching relations:", error);
                toast.error(`Failed to load relations: ${error.message}. Please try again.`);
            } finally {
                setIsLoadingBrands(false);
                setIsLoadingRelations(false);
            }
        }
        fetchRelations();
    }, []);

    useEffect(() => {
        if (!isEdit && specifications.length === 0) {
            toast("Please add at least one specification before submitting.", {
                icon: "ℹ️",
                duration: 5000,
            });
        }
    }, [isEdit, specifications.length]);

    useEffect(() => {
        if (watchData) {
            const defaultValues = {
                name: watchData.name || "",
                referenceCode: watchData.referenceCode || "",
                description: watchData.description || "",
                detail: watchData.detail ? JSON.stringify(watchData.detail) : "",
                price: parseFloat(watchData.price) || 0,
                stockQuantity: watchData.stockQuantity || 0,
                isAvailable: watchData.isAvailable ?? true,
                deletedAt: watchData.deletedAt ? new Date(watchData.deletedAt) : null,
                brandId: watchData.brand?.id || "",
                newBrand: "",
                newBrandDescription: "",
                logoInputType: undefined,
                newBrandLogoFile: null,
                newBrandLogoUrl: "",
                colors: watchData.colors?.map(c => c.color.id) || [],
                newColors: [],
                categories: watchData.categories?.map(c => c.category.id) || [],
                newCategories: [],
                concepts: watchData.concepts?.map(c => c.concept.id) || [],
                newConcepts: [],
                materials: watchData.materials?.map(m => m.material.id) || [],
                newMaterials: [],
                specifications: watchData.specificationHeadings?.map(s => ({
                    id: s.id,
                    heading: s.heading || "",
                    description: s.description || "",
                    specificationOptions: s.specificationPoints?.map(p => ({
                        id: p.id,
                        label: p.label || "",
                        value: p.value || "",
                    })) || [{ label: "", value: "" }],
                })) || [],
                primaryPhoto: null,
                primaryPhotoAltText: watchData.primaryPhotoUrl ? "Primary watch image" : "",
                secondaryPhotos: null,
                secondaryPhotosData: watchData.photos?.map(p => ({
                    id: p.id,
                    photoUrl: p.photoUrl,
                    altText: p.altText || "",
                    order: p.order,
                })) || [],
                existingPrimaryUrl: watchData.primaryPhotoUrl || "",
                existingSecondaryUrls: watchData.photos?.map(p => ({
                    id: p.id,
                    photoUrl: p.photoUrl,
                    altText: p.altText || "",
                    order: p.order,
                })) || [],
                removedImages: { primary: false, secondary: [] },
            };

            console.log("Setting default values for edit mode:", defaultValues);
            reset(defaultValues);
            setSpecifications(defaultValues.specifications);
            setExistingPrimaryUrl(watchData.primaryPhotoUrl ? [watchData.primaryPhotoUrl] : []);
            setExistingSecondaryUrls(watchData.photos?.map(p => ({
                id: p.id,
                photoUrl: p.photoUrl,
                altText: p.altText || "",
                order: p.order,
            })) || []);
        } else {
            console.log("Add mode: Ensuring primaryPhoto and secondaryPhotos are null");
            setValue("primaryPhoto", null);
            setValue("secondaryPhotos", null);
            setValue("secondaryPhotosData", []);
        }
    }, [watchData, reset, setValue]);

    useEffect(() => {
        if (isEdit && watchData?.brand?.id) {
            console.log("Edit mode detected with brandId:", watchData.brand.id, "Ensuring logoInputType is undefined");
            setValue("logoInputType", undefined);
            console.log("logoInputType after edit mode reset:", form.getValues("logoInputType"));
        }
    }, [isEdit, watchData, setValue, form]);

    useEffect(() => {
        console.log("brandId changed:", selectedBrand, "logoInputType before reset:", logoInputType);
        if (selectedBrand !== "other") {
            console.log("Resetting new brand fields as brandId is not 'other'");
            setValue("newBrand", "");
            setValue("newBrandDescription", "");
            setValue("logoInputType", undefined);
            setValue("newBrandLogoFile", null);
            setValue("newBrandLogoUrl", "");
            console.log("logoInputType after reset:", form.getValues("logoInputType"));
        }
    }, [selectedBrand, setValue, form, logoInputType]);

    const handleSpecificationsUpdate = (newSpecs) => {
        console.log("Updating specifications:", newSpecs);
        setSpecifications(newSpecs);
        setValue("specifications", newSpecs);
    };

    const handleRemoveExistingImage = (fieldName, url) => {
        console.log(`Removing existing image: ${fieldName}, URL: ${url}`);
        if (fieldName === "primaryPhoto") {
            setExistingPrimaryUrl([]);
            setValue("existingPrimaryUrl", "");
            setValue("removedImages", {
                primary: !!watchData?.primaryPhotoUrl,
                secondary: removedImages.secondary,
            });
        } else if (fieldName === "secondaryPhotos") {
            setExistingSecondaryUrls((prev) => {
                const newUrls = prev.filter((photo) => photo.photoUrl !== url);
                return newUrls;
            });
            setValue("existingSecondaryUrls", existingSecondaryUrls.filter((photo) => photo.photoUrl !== url));
            setValue("removedImages", {
                primary: removedImages.primary,
                secondary: [...new Set([...removedImages.secondary, url])],
            });
        }
    };

    const handleUpdatePhotoData = (index, field, value) => {
        console.log(`Updating photo data: index=${index}, field=${field}, value=${value}`);
        const currentData = watch("secondaryPhotosData") || [];
        const updatedData = [...currentData];
        updatedData[index] = { ...updatedData[index], [field]: value };
        setValue("secondaryPhotosData", updatedData);
    };

    const createColor = async (name) => {
        console.log(`Creating color: ${name}`);
        const response = await fetch(`${API_BASE_URL}/api/v1/colors`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create color");
        }
        const newColor = await response.json();
        setColorOptions((prev) => [...prev, { value: newColor.id, label: newColor.name }]);
        return newColor;
    };

    const createCategory = async (name) => {
        console.log(`Creating category: ${name}`);
        const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create category");
        }
        const newCategory = await response.json();
        setCategoryOptions((prev) => [...prev, { value: newCategory.id, label: newCategory.name }]);
        return newCategory;
    };

    const createConcept = async (name) => {
        console.log(`Creating concept: ${name}`);
        const response = await fetch(`${API_BASE_URL}/api/v1/concepts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create concept");
        }
        const newConcept = await response.json();
        setConceptOptions((prev) => [...prev, { value: newConcept.id, label: newConcept.name }]);
        return newConcept;
    };

    const createMaterial = async (name) => {
        console.log(`Creating material: ${name}`);
        const response = await fetch(`${API_BASE_URL}/api/v1/materials`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create material");
        }
        const newMaterial = await response.json();
        setMaterialOptions((prev) => [...prev, { value: newMaterial.id, label: newMaterial.name }]);
        return newMaterial;
    };

    async function onFormSubmit(data) {
        console.log("Form submission started with data:", data);
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            console.log("Preparing FormData...");
            Object.entries({
                ...data,
                id: watchData?.id,
                // detail: data.detail ? JSON.parse(data.detail) : undefined,
                existingPrimaryUrl: existingPrimaryUrl[0] || undefined,
                existingSecondaryUrls: JSON.stringify([...existingSecondaryUrls]),
                removedImages: JSON.stringify({
                    primary: data.removedImages.primary,
                    secondary: [...new Set(data.removedImages.secondary)],
                }),
                brandId: data.brandId === "other" ? undefined : data.brandId,
                newBrand: data.brandId === "other" ? data.newBrand || "" : undefined,
                newBrandDescription: data.brandId === "other" ? data.newBrandDescription : undefined,
                logoInputType: data.brandId === "other" ? data.logoInputType : undefined,
            }).forEach(([key, value]) => {
                if (key === "primaryPhoto" && value && "length" in value && value.length > 0) {
                    console.log(`Appending primaryPhoto: ${value.length} file(s)`);
                    Array.from(value).forEach((file) => formData.append(key, file));
                } else if (key === "primaryPhoto") {
                    console.log(`Skipping primaryPhoto: invalid or empty value`, value);
                }
                if (key === "secondaryPhotos" && value && "length" in value && value.length > 0) {
                    console.log(`Appending secondaryPhotos: ${value.length} file(s)`);
                    Array.from(value).forEach((file) => formData.append(key, file));
                } else if (key === "secondaryPhotos") {
                    console.log(`Skipping secondaryPhotos: invalid or empty value`, value);
                }
                if (key === "newBrandLogoFile" && value && data.brandId === "other" && data.logoInputType === "file" && "length" in value) {
                    console.log(`Appending newBrandLogoFile: ${value.length} file(s)`);
                    Array.from(value).forEach((file) => formData.append(key, file));
                } else if (key === "newBrandLogoFile") {
                    console.log(`Skipping newBrandLogoFile: invalid or not applicable`, value);
                }
                if (key === "newBrandLogoUrl" && data.brandId === "other" && data.logoInputType === "url") {
                    console.log(`Appending newBrandLogoUrl: ${value}`);
                    formData.append(key, value || "");
                } else if (key === "newBrandLogoUrl") {
                    console.log(`Skipping newBrandLogoUrl: not applicable`);
                }
                if (key === "secondaryPhotosData" && value) {
                    const cleanedData = value.map((photo) => ({
                        ...photo,
                        photoUrl: photo.photoUrl || undefined,
                    }));
                    console.log(`Appending secondaryPhotosData:`, cleanedData);
                    formData.append(key, JSON.stringify(cleanedData));
                }
                if (value !== undefined && value !== null && (key !== "logoInputType" && key !== "primaryPhoto" && key !== "secondaryPhotos" && key !== "newBrandLogoFile" && key !== "newBrandLogoUrl" && key !== "secondaryPhotosData" || data.brandId === "other")) {
                    console.log(`Appending ${key}:`, value);
                    formData.append(key, typeof value === "object" ? JSON.stringify(value) : value);
                } else if (key !== "primaryPhoto" && key !== "secondaryPhotos" && key !== "newBrandLogoFile" && key !== "newBrandLogoUrl" && key !== "secondaryPhotosData") {
                    console.log(`Skipping ${key}: value is undefined or null`);
                }
            });

            console.log(`Submitting to ${isEdit ? "PUT" : "POST"} ${API_BASE_URL}/api/v1/collections${isEdit ? `/${watchData.id}` : ""}`);
            const response = await fetch(isEdit ? `${API_BASE_URL}/api/v1/collections/${watchData.id}` : `${API_BASE_URL}/api/v1/collections`, {
                method: isEdit ? "PUT" : "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API response error:", errorData);
                throw new Error(errorData.error || `Failed to submit form: ${response.status}`);
            }

            const result = await response.json();
            console.log("API response success:", result);

            setValue("removedImages", { primary: false, secondary: [] });
            toast.success(isEdit ? "Watch updated successfully." : "Watch created successfully.");
            onSubmit();
        } catch (error) {
            console.error("Submission error:", error);
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map((err) => {
                    if (err.path.includes("specifications")) {
                        return "Please add at least one specification with valid details.";
                    }
                    if (err.path.includes("secondaryPhotosData")) {
                        return `Secondary photos data: ${err.message} at index ${err.path[1] || "unknown"}`;
                    }
                    if (err.path.includes("primaryPhoto")) {
                        return `Primary photo: ${err.message}`;
                    }
                    return `${err.path.join(".")}: ${err.message}`;
                });
                toast.error(`Validation errors: ${errorMessages.join("; ")}`, { duration: 5000 });
            } else if (error.message?.includes("Unique constraint")) {
                toast.error("Name or reference code already exists. Please use unique values.", { duration: 5000 });
            } else {
                toast.error(`Submission failed: ${error.message}`, { duration: 5000 });
            }
        } finally {
            setIsSubmitting(false);
            console.log("Form submission completed");
        }
    }

    const handleSubmitClick = () => {
        console.log("Submit button clicked, form state:", form.getValues());
        handleSubmit(
            (data) => {
                console.log("handleSubmit triggered with validated data:", data);
                onFormSubmit(data);
            },
            (errors) => {
                console.error("Validation errors:", errors);
                const errorMessages = Object.entries(errors).map(([field, error]) => {
                    if (field === "specifications" && !isEdit) {
                        return "Please add at least one specification with valid details.";
                    }
                    if (field === "secondaryPhotosData") {
                        return `Secondary photos data: ${error.message || "Invalid data"}`;
                    }
                    if (field === "primaryPhoto") {
                        return `Primary photo: ${error.message || "Invalid file"}`;
                    }
                    return `${field}: ${error.message || "Invalid input"}`;
                });
                toast.error(`Form validation failed: ${errorMessages.join("; ")}`, { duration: 5000 });
            }
        )();
    };

    if (isLoadingBrands || isLoadingRelations) {
        return <div className="text-center py-4">Loading form data...</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8">
                <div className="mx-auto max-w-4xl bg-card border border-border rounded-lg shadow-lg">
                    <div className="border-b border-border p-6">
                        <h2 className="text-lg font-semibold leading-none tracking-tight">
                            {isEdit ? "Edit Watch" : "Add Watch"}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isEdit
                                ? "Edit the watch details below. Click save when you're done."
                                : "Add a new watch here. You must add at least one specification and a primary photo before submitting."}
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            <div className="grid gap-4">
                                <TextField
                                    name="name"
                                    label="Name"
                                    placeholder="Rolex Submariner"
                                    register={register}
                                    error={errors.name}
                                />
                                <TextField
                                    name="referenceCode"
                                    label="Reference Code"
                                    placeholder="MN23034DK"
                                    register={register}
                                    error={errors.referenceCode}
                                />
                                <TextField
                                    name="description"
                                    label="Description"
                                    placeholder="A luxurious dive watch with exceptional craftsmanship..."
                                    as={Textarea}
                                    register={register}
                                    error={errors.description}
                                />
                                <TextField
                                    name="detail"
                                    label="Detail (Optional)"
                                    placeholder='{"features": "Chronograph, Date"}'
                                    as={Textarea}
                                    register={register}
                                    error={errors.detail}
                                />
                                <TextField
                                    name="price"
                                    label="Price"
                                    type="number"
                                    step="0.01"
                                    placeholder="1000.00"
                                    register={register}
                                    error={errors.price}
                                />
                                <TextField
                                    name="stockQuantity"
                                    label="Stock Quantity"
                                    type="number"
                                    placeholder="10"
                                    register={register}
                                    error={errors.stockQuantity}
                                />
                                <div className="grid gap-3">
                                    <Label>Availability</Label>
                                    <RadioGroup
                                        value={watch("isAvailable") ? "true" : "false"}
                                        onValueChange={(value) => setValue("isAvailable", value === "true")}
                                        className="flex gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id="available-true" />
                                            <Label htmlFor="available-true">Available</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id="available-false" />
                                            <Label htmlFor="available-false">Not Available</Label>
                                        </div>
                                    </RadioGroup>
                                    {errors.isAvailable && (
                                        <p id="isAvailable-error" className="text-red-500 text-sm">
                                            {errors.isAvailable.message}
                                        </p>
                                    )}
                                </div>
                                {isEdit && (
                                    <div className="grid gap-3">
                                        <Label>Soft Delete</Label>
                                        <Checkbox
                                            checked={watch("deletedAt") !== null}
                                            onCheckedChange={(checked) => setValue("deletedAt", checked ? new Date() : null)}
                                            id="deletedAt"
                                        />
                                        <Label htmlFor="deletedAt">Mark as deleted (soft delete)</Label>
                                        {watch("deletedAt") && (
                                            <p className="text-yellow-600 text-sm">
                                                Warning: Marking as deleted will hide this watch from public views.
                                            </p>
                                        )}
                                    </div>
                                )}
                                <SelectField
                                    name="brandId"
                                    label="Brand"
                                    placeholder="Select a brand"
                                    options={brandOptions}
                                    watch={watch}
                                    setValue={setValue}
                                    error={errors.brandId}
                                />
                                {selectedBrand === "other" && (
                                    <>
                                        <TextField
                                            name="newBrand"
                                            label="New Brand Name"
                                            placeholder="Enter new brand name"
                                            register={register}
                                            error={errors.newBrand}
                                        />
                                        <TextField
                                            name="newBrandDescription"
                                            label="Brand Description (Optional)"
                                            placeholder="Enter brand description"
                                            as={Textarea}
                                            register={register}
                                            error={errors.newBrandDescription}
                                        />
                                        <div className="grid gap-3">
                                            <Label>Brand Logo</Label>
                                            <RadioGroup
                                                value={logoInputType || ""}
                                                onValueChange={(value) => {
                                                    console.log("Setting logoInputType to:", value || undefined);
                                                    setValue("logoInputType", value || undefined);
                                                }}
                                                className="flex gap-4"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="file" id="logo-file" />
                                                    <Label htmlFor="logo-file">Upload Logo File</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="url" id="logo-url" />
                                                    <Label htmlFor="logo-url">Enter Logo URL</Label>
                                                </div>
                                            </RadioGroup>
                                            {errors.logoInputType && (
                                                <p id="logoInputType-error" className="text-red-500 text-sm">
                                                    {errors.logoInputType.message}
                                                </p>
                                            )}
                                            {logoInputType === "file" && (
                                                <FileField
                                                    name="newBrandLogoFile"
                                                    label="Brand Logo File"
                                                    register={register}
                                                    error={errors.newBrandLogoFile}
                                                    watch={watch}
                                                    setValue={setValue}
                                                    accept=".jpg,.jpeg,.png,.webp"
                                                    isEdit={isEdit}
                                                />
                                            )}
                                            {logoInputType === "url" && (
                                                <TextField
                                                    name="newBrandLogoUrl"
                                                    label="Brand Logo URL"
                                                    placeholder="Enter brand logo URL"
                                                    register={register}
                                                    error={errors.newBrandLogoUrl}
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                                <MultiSelectField
                                    name="colors"
                                    newName="newColors"
                                    label="Colors"
                                    placeholder="Select colors"
                                    options={colorOptions}
                                    watch={watch}
                                    setValue={setValue}
                                    error={errors.colors}
                                    createAction={createColor}
                                />
                                <MultiSelectField
                                    name="categories"
                                    newName="newCategories"
                                    label="Categories"
                                    placeholder="Select categories"
                                    options={categoryOptions}
                                    watch={watch}
                                    setValue={setValue}
                                    error={errors.categories}
                                    createAction={createCategory}
                                />
                                <MultiSelectField
                                    name="concepts"
                                    newName="newConcepts"
                                    label="Concepts"
                                    placeholder="Select concepts"
                                    options={conceptOptions}
                                    watch={watch}
                                    setValue={setValue}
                                    error={errors.concepts}
                                    createAction={createConcept}
                                />
                                <MultiSelectField
                                    name="materials"
                                    newName="newMaterials"
                                    label="Materials"
                                    placeholder="Select materials"
                                    options={materialOptions}
                                    watch={watch}
                                    setValue={setValue}
                                    error={errors.materials}
                                    createAction={createMaterial}
                                />
                                <FileField
                                    name="primaryPhoto"
                                    label="Primary Photo"
                                    register={register}
                                    error={errors.primaryPhoto}
                                    watch={watch}
                                    setValue={setValue}
                                    accept=".jpg,.jpeg,.png,.webp"
                                    existingUrls={existingPrimaryUrl.map((url) => ({
                                        photoUrl: url,
                                        altText: watch("primaryPhotoAltText"),
                                        order: 0,
                                    }))}
                                    onRemoveExisting={(url) => handleRemoveExistingImage("primaryPhoto", url)}
                                    isEdit={isEdit}
                                    altTextName="primaryPhotoAltText"
                                />
                                <FileField
                                    name="secondaryPhotos"
                                    label="Other Photos"
                                    register={register}
                                    error={errors.secondaryPhotos}
                                    watch={watch}
                                    setValue={setValue}
                                    multiple
                                    accept=".jpg,.jpeg,.png,.webp"
                                    existingUrls={existingSecondaryUrls}
                                    onRemoveExisting={(url) => handleRemoveExistingImage("secondaryPhotos", url)}
                                    isEdit={isEdit}
                                    orderName="secondaryPhotosData"
                                    onUpdatePhotoData={handleUpdatePhotoData}
                                />
                                <SpecificationsField
                                    specifications={specifications}
                                    onUpdate={handleSpecificationsUpdate}
                                    errors={errors.specifications}
                                    categories={specificationCategories}
                                    isEdit={isEdit}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={isSubmitting}
                                    aria-label="Cancel"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSubmitClick}
                                    disabled={isSubmitting || isLoadingBrands || isLoadingRelations}
                                    aria-label="Save changes"
                                >
                                    {isSubmitting ? "Saving..." : isEdit ? "Update Watch" : "Create Watch"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}