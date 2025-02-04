// "use client"

// /* eslint-disable react-hooks/exhaustive-deps */
// import { AppSidebar } from "@/components/app-sidebar";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbList,
//   BreadcrumbPage,
// } from "@/components/ui/breadcrumb";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { useRouter } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";
// import useAuthStore from "@/authStore";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import toast from "react-hot-toast";
// import axios from "axios";
// import dynamic from "next/dynamic";
// import "react-quill/dist/quill.snow.css";
// import Link from "next/link";

// // Dynamic import for ReactQuill to avoid SSR issues
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// export default function BlogCreate() {
//   const { token, admin } = useAuthStore();
//   const router = useRouter();
//   const [error, setError] = useState(null);

//   const modules = useMemo(
//     () => ({
//       toolbar: {
//         container: [
//           [{ header: [1, 2, 3, 4, 5, 6, false] }],
//           ["bold", "italic", "underline", "strike"],
//           [
//             { align: "" },
//             { align: "center" },
//             { align: "right" },
//             { align: "justify" },
//           ],
//           [
//             { list: "ordered" },
//             { list: "bullet" },
//             { indent: "-1" },
//             { indent: "+1" },
//           ],
//           [
//             {
//               color: [
//                 "#000000",
//                 "#e60000",
//                 "#ff9900",
//                 "#ffff00",
//                 "#008a00",
//                 "#0066cc",
//                 "#9933ff",
//                 "#ffffff",
//                 "#facccc",
//                 "#ffebcc",
//                 "#ffffcc",
//                 "#cce8cc",
//                 "#cce0f5",
//                 "#ebd6ff",
//                 "#bbbbbb",
//                 "#f06666",
//                 "#ffc266",
//                 "#ffff66",
//                 "#66b966",
//                 "#66a3e0",
//                 "#c285ff",
//                 "#888888",
//                 "#a10000",
//                 "#b26b00",
//                 "#b2b200",
//                 "#006100",
//                 "#0047b2",
//                 "#6b24b2",
//                 "#444444",
//                 "#5c0000",
//                 "#663d00",
//                 "#666600",
//                 "#003700",
//                 "#002966",
//                 "#3d1466",
//               ],
//             },
//           ],
//         ],
//       },
//     }),
//     []
//   );

//   const [photographers, setPhotographers] = useState([]);
//   const [authorType, setAuthorType] = useState("Admin");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredOptions, setFilteredOptions] = useState([]);
//   const [blog, setBlog] = useState({
//     authorInfo: {
//       author: undefined,
//       authorType: undefined,
//     },
//     slug: "",
//     content: {
//       title: "",
//       summary: "",
//       body: "",
//     },
//     coverImage: "",
//     tags: [],
//     photographer: undefined,
//     achievements: [],
//     blogType: "blog",
//     isActive: true,
//   });

//   const validateForm = () => {
//     if (!blog.content.title.trim()) {
//       toast.error("Title is required.");
//       return false;
//     }
//     if (!blog.content.body.trim()) {
//       toast.error("Body is required.");
//       return false;
//     }
//     return true;
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const uploadData = new FormData();
//     uploadData.append("image", file);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER}/api/upload/uploadSingleImage`,
//         {
//           method: "POST",
//           body: uploadData,
//         }
//       );
//       const data = await res.text();
//       if (res.ok) {
//         setBlog((prev) => ({
//           ...prev,
//           coverImage: data,
//         }));
//         toast.success("Image uploaded successfully!");
//       } else {
//         toast.error("Image upload failed.");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("An error occurred while uploading the image.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_SERVER}/api/blog/add-blog`,
//         blog,
//         {
//           headers: {
//             "x-auth-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const data = await response.data;
//       if (data.error) {
//         return toast.error(data.error);
//       }
//       toast.success("Blog added successfully");
//       router.push("/blog");
//     } catch (error) {
//       console.error(error);
//       setError(error.response.data.message);
//     }
//   };

//   useEffect(() => {
//     const fetchPhotographers = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/get-all-photographers`
//         );
//         const data = response.data;
//         console.log(data);
//         setPhotographers(data.photographers);
//       } catch (error) {
//         console.error(error);
//         setError(error.response.data.message);
//       }
//     };
//     fetchPhotographers();
//   }, []);

//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredOptions(photographers);
//     } else {
//       const lowerSearchTerm = searchTerm.toLowerCase();
//       setFilteredOptions(
//         photographers.filter((photographer) => {
//           return (
//             photographer.firstName.toLowerCase().includes(lowerSearchTerm) ||
//             photographer.lastName.toLowerCase().includes(lowerSearchTerm) ||
//             photographer.email.toLowerCase().includes(lowerSearchTerm)
//           );
//         })
//       );
//     }
//   }, [searchTerm, photographers]);

//   return (
//     <SidebarProvider>
//       <AppSidebar url="/blog/create" />
//       <SidebarInset>
//         <header className="flex h-16 items-center gap-2 border-b px-4 shadow-md bg-blue-200">
//           <SidebarTrigger className="-ml-1" />
//           <Separator orientation="vertical" className="mr-2 h-4" />
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbPage>
//                   <Link className="text-blue-600 hover:underline" href="/">
//                     Dashboard
//                   </Link>
//                   &nbsp; &gt; &nbsp;
//                   <Link className="text-blue-600 hover:underline" href="/blog">
//                     Blog
//                   </Link>
//                   &nbsp; &gt; &nbsp;
//                   <span>Add</span>
//                 </BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </header>

//         <div className="p-4">
//           <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
//             <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
//               Create Blog
//             </h1>
//             <div className="bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)] rounded-lg p-6 space-y-6">
//               <div>
//                 <Label htmlFor="coverImage">Cover Image</Label>
//                 <Input
//                   id="coverImage"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                 />
//                 {blog.coverImage && (
//                   <img
//                     src={blog.coverImage}
//                     alt="Cover Preview"
//                     className="mt-4 w-full h-48 object-contain rounded-lg shadow-sm"
//                   />
//                 )}
//               </div>
//               <div>
//                 <Label htmlFor="title">Title</Label>
//                 <Input
//                   id="title"
//                   type="text"
//                   value={blog.content.title}
//                   onChange={(e) =>
//                     setBlog({
//                       ...blog,
//                       content: { ...blog.content, title: e.target.value },
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="summary">Summary</Label>
//                 <Textarea
//                   id="summary"
//                   value={blog.content.summary}
//                   onChange={(e) =>
//                     setBlog({
//                       ...blog,
//                       content: { ...blog.content, summary: e.target.value },
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="body">Body</Label>
//                 <ReactQuill
//                   modules={modules}
//                   theme="snow"
//                   value={blog.content.body}
//                   onChange={(value) =>
//                     setBlog({
//                       ...blog,
//                       content: { ...blog.content, body: value },
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="tags">Tags</Label>
//                 <Input
//                   id="tags"
//                   type="text"
//                   value={blog.tags.join(", ")}
//                   onChange={(e) =>
//                     setBlog({
//                       ...blog,
//                       tags: e.target.value.split(",").map((tag) => tag.trim()),
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="blogType">Blog Type</Label>
//                 <Select
//                   onValueChange={(value) =>
//                     setBlog({ ...blog, blogType: value })
//                   }
//                   value={blog.blogType}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select blog type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="blog">Blog</SelectItem>
//                     <SelectItem value="successstory">Success Story</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               {blog.blogType === "successstory" && (
//                 <>
//                   <div>
//                     <Label htmlFor="photographer">Photographer</Label>
//                     <Select
//                       onValueChange={(value) => {
//                         setBlog({ ...blog, photographer: value });
//                         setSearchTerm("");
//                       }}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select photographer" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <div className="p-2">
//                           <Input
//                             type="text"
//                             placeholder="Search Images..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full"
//                           />
//                         </div>
//                         {filteredOptions.map((photographer) => (
//                           <SelectItem
//                             key={photographer._id}
//                             value={photographer._id}
//                           >
//                             {photographer.firstName} {photographer.lastName} (
//                             {photographer.email})
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label htmlFor="achievements">Achievements</Label>
//                     <Input
//                       id="achievements"
//                       type="text"
//                       value={blog.achievements.join(", ")}
//                       onChange={(e) =>
//                         setBlog({
//                           ...blog,
//                           achievements: e.target.value
//                             .split(",")
//                             .map((a) => a.trim()),
//                         })
//                       }
//                     />
//                   </div>
//                 </>
//               )}
//               <hr />
//               <Label htmlFor="authorType">Author Type</Label>
//               <Select
//                 onValueChange={(value) => setAuthorType(value)}
//                 defaultValue="Admin"
//               >
//                 <SelectTrigger>
//                   <SelectValue>{authorType}</SelectValue>
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Admin">Admin</SelectItem>
//                   <SelectItem value="Photographer">Photographer</SelectItem>
//                 </SelectContent>
//               </Select>
//               {authorType === "Photographer" && (
//                 <div>
//                   <Label htmlFor="author">Author</Label>
//                   <Select
//                     onValueChange={(value) => {
//                       setBlog({
//                         ...blog,
//                         authorInfo: { author: value, authorType },
//                       });
//                       setSearchTerm("");
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select author" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <div className="p-2">
//                         <Input
//                           type="text"
//                           placeholder="Search Images..."
//                           value={searchTerm}
//                           onChange={(e) => setSearchTerm(e.target.value)}
//                           className="w-full"
//                         />
//                       </div>
//                       {filteredOptions.map((photographer) => (
//                         <SelectItem
//                           key={photographer._id}
//                           value={photographer._id}
//                         >
//                           {photographer.firstName} {photographer.lastName} (
//                           {photographer.email})
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}
//               {error && <p className="text-red-500 text-sm">{error}</p>}
//               <Button
//                 variant="primary"
//                 type="submit"
//                 className="w-full bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 Create Blog
//               </Button>
//             </div>
//           </form>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }


import React from 'react'

export default function page() {
  return (
    <div>page</div>
  )
}
