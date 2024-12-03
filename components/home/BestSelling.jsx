import React from "react";
import BestSellingCard from "../cards/BestSellingCard";

export default function BestSelling() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center font-bold text-heading-05 sm:text-heading-03 md:text-heading-02 text-accent-400 mb-10">
        Hot Right Now: Best Selling Artworks!
      </h1>
      <div className="w-full">
        <BestSellingCard
          images={[
            {
              src1: "https://s3-alpha-sig.figma.com/img/4d19/b23e/3d228a3fd195bfa60377fd55d160a5b1?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iFkKprzSqDNKTU9LlLwSTHXLfAGis5CwOeNvKaH2Kczk9K-JZntq0VUkJo-DBgltcohdJ9x3iXNrPzCZSNqkto2QzhpoMuFkYEsMkt-katm8EYRoLj89be0Zb~4te0P5WaAhtQX6tzM3dGv9hX4HJic7ZyaIR-ab3DcjK62upJYz0Gylt6zfNjUIv2CZ82vxnL72CW2QuefV7x2hz-exkTS2mXKk7upNDgPlvosOU~u~V1ej33BASAkcjpm2hgLjf0YvZlOejdKFGCBLbPasAAXvhHCUmhkQuQOP95AfDoPMGgZ9KT9T~yTNW3gZRCHoUtYmiLDd4AHu0VZ6QCMaCg__",
              src2: "https://s3-alpha-sig.figma.com/img/2963/f885/97ce761fc4381ad4166c64b7d27aeb70?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EF~kcq~y~gs-UsCxU4FU6aujyBn-hkmQQIagEGmT3uYydJ~xG9QRK5cq-9kDQ0TR15twg0YRj9jKX2DWWLL8P4bd~2lJsRjGJMNjc0qLljsRVGFsl0sxFTA7NRvFKgZ6eEaow8x8f~3iMUHMOX-deRfVcNghn6XtD2basPVR34XL~7SeBkl0CqxMt72G~aVEpLfOlCl1gCabioDsKA-3hBiKBDnTjsYkSFEEMLkm9FZErYF4RdYaXVXugvNizsDkLv5onWRarYmmRrbqzRQqRqutcwbq3F3g1aPeUgtYQ0UeBCpmLlbiEKSCsCczuCfXQa0D6Rw5~ZaVUzxjIRsS9w__",
              title: "Artwork 1",
              artist: "Artist 1",
              downloadCount: 500,
            },
            {
              src1: "https://s3-alpha-sig.figma.com/img/627b/0b6d/20a3bf4dde77d7b1dc1c7d9f234ce523?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=P1P4CGFUcqeUAwJ8ukcMs0CNdoDzCmpslbhU~4eNAiHr0sliOUzk5IXv5tjDXGs5ZrYb7PxsmeQDqWqC~ZSg4t0XAU6wBuwFGIS9X513iWiiuR3doAoDnimLrDT0WUcrDiemoZ~Oe3qUOfx2pQeFzietDvf6a-uWYRfekdZFBPjhqiJRa3tDDotfq3v7DvSRE4lUEDSH~rxZlB68mRJJp9XTFtLcx3d~HsKcJMHiP2lE5x-ztoErFyYPtLa6SqkJ07vU6BAztBLtC9Ix7GM1qoPntgBYgc3Xc1y86pEUGZTsal0wOjqPyxWcxWKr8q2374S7tKk~zm3Pl~v5MworZA__",
              src2: "https://s3-alpha-sig.figma.com/img/e0ba/4075/3ac746689c6de1ed92081be3be7becee?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HSDYuBAZw6z0xUcUEtpf869llLU0P9WVBaVwWfUFGk8KfO0V1SYUkCnaTNtS~a~D62NnSH4OC9nNEHQKaOOOP3ppxn7dDsv-D~aWF55rPqjyRj87XlwZN7d8Ivzn69QUDk1qph20925PU6uPGXPdDJI3sjNhcTUxzVOYeDh3cebTQecqvQCJxJySuwZsuopPu49zK4kARS8OIrupEUFZZ0bSaYb8ZJofBBFJO7hqHpgjRXPkace-gRMlJ1xGMxsF0ookgyvbAPrjpOhEDIKNXakNv1WiKjOPxAWFbCJScFs~QlKwJgjXPSn0bzjPRIr2KygqOQNyGCKMUCjFF7Yg9w__",
              title: "Artwork 2",
              artist: "Artist 2",
              downloadCount: 450,
            },
            {
              src1: "https://s3-alpha-sig.figma.com/img/4d19/b23e/3d228a3fd195bfa60377fd55d160a5b1?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RJleyEbrM8Siv1irCjW28y86eWG8YfloSsB65haSB6pu-SZvxFugBo9IiETrUWj0eDx2Uv2x8z~C4ZTuoAEGSrme1WpWEqgpNW1qejQuAle5yT~Sfu9FW6lb0pkfkass44lHqmhHH12A9tr6zyPseACmzQdoONijSubghjUmFeZx4kgsXOSqt9ttfgdY8AAcSCRZIzRIN4I4ImVNbrinSrVlTRN3Um-NHa5yabAutJVpUyM2PRmrUb2pwGCjoetmKh9SLzxAnAUWzrcRFO2NtZ80gkR6UNXONVLXOuEhpwVin9n29EcbGn92XMHi3PSHW-w8R7QYc2YialXiEq~IQQ__",
              src2: "https://s3-alpha-sig.figma.com/img/d418/6a78/00a8d79ef1d6324d09648113c5ef5719?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AmfsVgifhXFMXSqnItPzdfdRdlL~kzxn8~ijJeamj~X43J1KEEWKwwPlBkVS48luKcfQ~DSBbfGC9rrS6ush9L3P9PLgEFKtKPm1pUErVjtjkwdUuwj7wPiO-6NLL8NJh8UZI6~53j27VSeMnQE8AifFC0DkRNtabGDfuHGYWHV~KOzqzQkjMasQ8ipEeDrx2FD0eBFokcSWC3A-2FoLa3Y-QBC73bTO5u-Zc4Z1Wp6eR5PxuliFqMl9SGlZwP~0Yzs4vCVmQy3yGvQtYuXuCvbyQvIQejrkGm28EFUTbxhHWYobghwjR5kiLXS6hapQeHa6GsfcyTyf5ikhIUWU9A__",
              title: "Artwork 3",
              artist: "Artist 3",
              downloadCount: 400,
            },
            {
              src1: "https://s3-alpha-sig.figma.com/img/4d19/b23e/3d228a3fd195bfa60377fd55d160a5b1?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iFkKprzSqDNKTU9LlLwSTHXLfAGis5CwOeNvKaH2Kczk9K-JZntq0VUkJo-DBgltcohdJ9x3iXNrPzCZSNqkto2QzhpoMuFkYEsMkt-katm8EYRoLj89be0Zb~4te0P5WaAhtQX6tzM3dGv9hX4HJic7ZyaIR-ab3DcjK62upJYz0Gylt6zfNjUIv2CZ82vxnL72CW2QuefV7x2hz-exkTS2mXKk7upNDgPlvosOU~u~V1ej33BASAkcjpm2hgLjf0YvZlOejdKFGCBLbPasAAXvhHCUmhkQuQOP95AfDoPMGgZ9KT9T~yTNW3gZRCHoUtYmiLDd4AHu0VZ6QCMaCg__",
              src2: "https://s3-alpha-sig.figma.com/img/2963/f885/97ce761fc4381ad4166c64b7d27aeb70?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EF~kcq~y~gs-UsCxU4FU6aujyBn-hkmQQIagEGmT3uYydJ~xG9QRK5cq-9kDQ0TR15twg0YRj9jKX2DWWLL8P4bd~2lJsRjGJMNjc0qLljsRVGFsl0sxFTA7NRvFKgZ6eEaow8x8f~3iMUHMOX-deRfVcNghn6XtD2basPVR34XL~7SeBkl0CqxMt72G~aVEpLfOlCl1gCabioDsKA-3hBiKBDnTjsYkSFEEMLkm9FZErYF4RdYaXVXugvNizsDkLv5onWRarYmmRrbqzRQqRqutcwbq3F3g1aPeUgtYQ0UeBCpmLlbiEKSCsCczuCfXQa0D6Rw5~ZaVUzxjIRsS9w__",
              title: "Artwork 4",
              artist: "Artist 4",
              downloadCount: 350,
            },
            {
              src1: "https://s3-alpha-sig.figma.com/img/627b/0b6d/20a3bf4dde77d7b1dc1c7d9f234ce523?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=P1P4CGFUcqeUAwJ8ukcMs0CNdoDzCmpslbhU~4eNAiHr0sliOUzk5IXv5tjDXGs5ZrYb7PxsmeQDqWqC~ZSg4t0XAU6wBuwFGIS9X513iWiiuR3doAoDnimLrDT0WUcrDiemoZ~Oe3qUOfx2pQeFzietDvf6a-uWYRfekdZFBPjhqiJRa3tDDotfq3v7DvSRE4lUEDSH~rxZlB68mRJJp9XTFtLcx3d~HsKcJMHiP2lE5x-ztoErFyYPtLa6SqkJ07vU6BAztBLtC9Ix7GM1qoPntgBYgc3Xc1y86pEUGZTsal0wOjqPyxWcxWKr8q2374S7tKk~zm3Pl~v5MworZA__",
              src2: "https://s3-alpha-sig.figma.com/img/e0ba/4075/3ac746689c6de1ed92081be3be7becee?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HSDYuBAZw6z0xUcUEtpf869llLU0P9WVBaVwWfUFGk8KfO0V1SYUkCnaTNtS~a~D62NnSH4OC9nNEHQKaOOOP3ppxn7dDsv-D~aWF55rPqjyRj87XlwZN7d8Ivzn69QUDk1qph20925PU6uPGXPdDJI3sjNhcTUxzVOYeDh3cebTQecqvQCJxJySuwZsuopPu49zK4kARS8OIrupEUFZZ0bSaYb8ZJofBBFJO7hqHpgjRXPkace-gRMlJ1xGMxsF0ookgyvbAPrjpOhEDIKNXakNv1WiKjOPxAWFbCJScFs~QlKwJgjXPSn0bzjPRIr2KygqOQNyGCKMUCjFF7Yg9w__",
              title: "Artwork 5",
              artist: "Artist 5",
              downloadCount: 300,
            },
            {
              src1: "https://s3-alpha-sig.figma.com/img/4d19/b23e/3d228a3fd195bfa60377fd55d160a5b1?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RJleyEbrM8Siv1irCjW28y86eWG8YfloSsB65haSB6pu-SZvxFugBo9IiETrUWj0eDx2Uv2x8z~C4ZTuoAEGSrme1WpWEqgpNW1qejQuAle5yT~Sfu9FW6lb0pkfkass44lHqmhHH12A9tr6zyPseACmzQdoONijSubghjUmFeZx4kgsXOSqt9ttfgdY8AAcSCRZIzRIN4I4ImVNbrinSrVlTRN3Um-NHa5yabAutJVpUyM2PRmrUb2pwGCjoetmKh9SLzxAnAUWzrcRFO2NtZ80gkR6UNXONVLXOuEhpwVin9n29EcbGn92XMHi3PSHW-w8R7QYc2YialXiEq~IQQ__",
              src2: "https://s3-alpha-sig.figma.com/img/d418/6a78/00a8d79ef1d6324d09648113c5ef5719?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AmfsVgifhXFMXSqnItPzdfdRdlL~kzxn8~ijJeamj~X43J1KEEWKwwPlBkVS48luKcfQ~DSBbfGC9rrS6ush9L3P9PLgEFKtKPm1pUErVjtjkwdUuwj7wPiO-6NLL8NJh8UZI6~53j27VSeMnQE8AifFC0DkRNtabGDfuHGYWHV~KOzqzQkjMasQ8ipEeDrx2FD0eBFokcSWC3A-2FoLa3Y-QBC73bTO5u-Zc4Z1Wp6eR5PxuliFqMl9SGlZwP~0Yzs4vCVmQy3yGvQtYuXuCvbyQvIQejrkGm28EFUTbxhHWYobghwjR5kiLXS6hapQeHa6GsfcyTyf5ikhIUWU9A__",
              title: "Artwork 6",
              artist: "Artist 6",
              downloadCount: 250,
            }
          ]}
        />
      </div>
    </div>
  );
}
