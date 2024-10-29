// Type
import { UserDetails, UserData, Tag } from "@/types";
// Component
import UserProfile from "@/components/user/UserProfile";
import UserPost from "@/components/user/UserPost";
// Server
import { getData, auth } from "@/app/actions";

async function Page({ params }: { params: { id: string } }) {
  const data: UserDetails = await getData(`/user/${params.id}`, Tag.UserData);
  const user: UserData | null = await auth();
  const totalPosts = data.posts.length;
  const owner = user?._id === data._id;

  return (
    <main className="main-container bg-gray-100">
      {/* User Info */}
      <UserProfile owner={owner} totalPosts={totalPosts} {...data} />
      {/* Posts */}
      <UserPost owner={owner} totalPosts={totalPosts} posts={data.posts} />
    </main>
  );
}

export default Page;
