import { useState } from "react";
import { toast } from "sonner";
import WatchForm from "../components/WatchForm";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import api from "../../../../config/apiConfig";

const EditWatch = () => {
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [watch, setWatch] = useState(null);

    useEffect(() => {
        (
            async () => {
                const data = await axios.get(api.getUrl('collectionDetails', id));
                console.log(data.data.data);
                setWatch(data.data.data);
            }
        )();
    }, [])

    const handleSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            console.log(data)
            // console.log("Submitting form data:", {
            //     ...data,
            //     primaryPhoto: data.primaryPhoto ? `${data.primaryPhoto.length} file(s)` : "none",
            //     secondaryPhotos: data.secondaryPhotos ? `${data.secondaryPhotos.length} file(s)` : "none",
            //     newBrandLogoFile: data.newBrandLogoFile ? `${data.newBrandLogoFile.length} file(s)` : "none",
            // });

            // The WatchForm.jsx already handles FormData creation and API submission
            // This callback is invoked after a successful response
            // toast.success("Watch added successfully!");
            // Optionally, redirect or update UI
            // Example: window.location.href = "/admin/products";

            toast.success("Watch added successfully!");
            navigate("/admin/products");
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(`Failed to save watch: ${error.message || "Unknown error"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        toast("Form cancelled");
        navigate("/admin/products");
    }

    return (
        <div className="min-h-screen bgbackground">
            <WatchForm watchData={watch} onSubmit={handleSubmit} onCancel={handleCancel} disabled={isSubmitting} />
        </div>
    );
};

export default EditWatch;