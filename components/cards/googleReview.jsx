import Image from "next/image";

const GoogleReviewCard = ({ avatar, name, rating, comment }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4 w-full">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12">
          <Image
            src={avatar || "/assets/placeholders/profile.jpg"}
            alt={name}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-lg">{name}</p>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                fill={index < rating ? "#FFC107" : "#E0E0E0"}
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <div className="text-gray-600">{comment}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {/* Google Logo */}
          <Image
            src="/assets/google_logo.webp"
            alt="Google"
            width={20}
            height={20}
          />
          <p>Google Review</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleReviewCard;
