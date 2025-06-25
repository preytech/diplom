import React from "react";
import Image from "next/image";

interface DoctorCardProps {
    name: string;
    photo: string | null;
    rating: number;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ name, photo, rating }) => {
    // Generate star rating
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return (
            <div className="flex gap-1">
                {[...Array(fullStars)].map((_, i) => (
                    <Image
                        key={`full-${i}`}
                        src="/media/doctors/star.svg"
                        alt="filled star"
                        width={20}
                        height={20}
                    />
                ))}
                {halfStar > 0 && (
                    <Image
                        src="/media/doctors/star.svg"
                        alt="half star"
                        width={20}
                        height={20}
                        className="opacity-50"
                    />
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <Image
                        key={`empty-${i}`}
                        src="/media/doctors/grayStar.svg"
                        alt="empty star"
                        width={20}
                        height={20}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="doctor-card flex flex-col border border-Trans20 p-6 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-full aspect-square relative mb-4">
                <Image
                    src={photo || "/media/doctors/doctor0.svg"}
                    alt={`Фото доктора ${name}`}
                    fill
                    className="object-cover rounded-lg"
                />
            </div>
            <div className="flex flex-col gap-2">
                <p className="doctor-name font-Bold text-xl">{name}</p>
                {renderStars(rating)}
            </div>
        </div>
    );
};

export default DoctorCard;
