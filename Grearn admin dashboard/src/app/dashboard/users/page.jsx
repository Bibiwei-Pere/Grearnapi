"use client";
// import { deleteUser } from "@/app/lib/actions";
// import { fetchUsers } from "@/app/lib/data";
import { useGetAllUsers } from "@/hooks/users";
import Pagination from "../../../app/components/dashboard/pagination/pagination";
import Search from "../../../app/components/dashboard/search/search";
import styles from "../../../app/components/dashboard/users/users.module.css";
import Image from "next/image";
import Link from "next/link";
import { SkeletonCard1 } from "@/components/ui/skeleton";

const UsersPage = ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const allUsers = useGetAllUsers();
  console.log(allUsers);
  // const { count, users } = await fetchUsers(q, page);

  if (allUsers.status !== "success") return <SkeletonCard1 />;
  else
    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <Search placeholder="Search for a user..." />
          <Link href="/dashboard/users/add">
            <button className={styles.addButton}>Add New</button>
          </Link>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <td>Name</td>
              <td>Email</td>
              <td>Created At</td>
              <td>Role</td>
              <td>Status</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {allUsers?.data.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className={styles.user}>
                    <Image
                      src={user.img || "/noavatar.png"}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImage}
                    />
                    {user.username}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.createdAt?.toString().slice(4, 16)}</td>
                <td>{user.isAdmin ? "Admin" : "Client"}</td>
                <td>{user.isActive ? "active" : "passive"}</td>
                <td>
                  <div className={styles.buttons}>
                    <Link href={`/dashboard/users/${user._id}`}>
                      <button className={`${styles.button} ${styles.view}`}>
                        View
                      </button>
                    </Link>
                    {/* <form action={deleteUser}> */}
                    <form>
                      <input type="hidden" name="id" value={user.id} />
                      <button className={`${styles.button} ${styles.delete}`}>
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination count={10} />
        {/* <Pagination count={count} /> */}
      </div>
    );
};

export default UsersPage;