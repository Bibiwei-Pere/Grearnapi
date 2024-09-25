"use client";
// import { updateUser } from "@/app/lib/actions";
// import { fetchUser } from "@/app/lib/data";

import { useGetUserById } from "@/hooks/users";
import styles from "../../../../app/components/dashboard/users/singleUser/singleUser.module.css";
import Image from "next/image";
import { SkeletonCard1 } from "@/components/ui/skeleton";

const SingleUserPage = ({ params }) => {
  const { id } = params;
  const user = useGetUserById(id);
  console.log(user);
  if (user.status !== "success") return <SkeletonCard1 />;
  else
    return (
      <div className={styles.container}>
        <div className={styles.infoContainer}>
          <div className={styles.imgContainer}>
            <Image src="/noavatar.png" alt="" fill />
          </div>
          {user.data.username}
        </div>
        <div className={styles.formContainer}>
          {/* <form action={updateUser} className={styles.form}> */}
          <form className={styles.form}>
            <input type="hidden" name="id" value={user.data._id} />
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder={user.data.username}
            />
            <label>Email</label>
            <input type="email" name="email" placeholder={user.data.email} />
            <label>Password</label>
            <input type="password" name="password" />
            <label>Phone</label>
            <input type="text" name="phone" placeholder={user.data.phone} />
            <label>Address</label>
            <textarea
              type="text"
              name="address"
              placeholder={user.data.address}
            />
            <label>Is Admin?</label>
            <select name="isAdmin" id="isAdmin">
              <option value={true} selected={user.data.isAdmin}>
                Yes
              </option>
              <option value={false} selected={!user.data.isAdmin}>
                No
              </option>
            </select>
            <label>Is Active?</label>
            <select name="isActive" id="isActive">
              <option value={true} selected={user.isActive}>
                Yes
              </option>
              <option value={false} selected={!user.isActive}>
                No
              </option>
            </select>
            <button>Update</button>
          </form>
        </div>
      </div>
    );
};

export default SingleUserPage;
