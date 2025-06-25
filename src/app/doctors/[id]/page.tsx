"use client";

import { use, useState } from "react";
import DoctorDetails from "../components/DoctorDetails";
import ReviewList from "../components/ReviewList";
import ReviewFormWhrapper from "../components/ReviewForm";

interface DoctorPageProps {
    params: Promise<{ id: string }>;
}

export default function DoctorPage({ params }: DoctorPageProps) {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [reviews, setReviews] = useState([]);

    const { id } = use(params);

    return (
        <div className="container mx-auto px-4 py-8">
            <DoctorDetails doctorId={id} />
            <ReviewList doctorId={id} />
            <ReviewFormWhrapper doctorId={id} />
        </div>
    );
}
