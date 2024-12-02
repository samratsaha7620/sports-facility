import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "@/config";
import { FaExclamationCircle } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { userAuthState } from "@/recoil";

interface Club {
  id: string;
  name: string;
  description: string;
  joinedDate: string; // Date string for when the user joined
  validTill: string | null; // Date string for membership validity
  fees: Fee[];
}

interface Fee {
  id: string;
  type: "MONTHLY" | "ANNUALLY" | "FINE" | "OTHER";
  description: string,
  amount: number;
  dueDate: string;
  status: "PAID" | "PENDING" | "OVERDUE";
}

const MyClubMemberships = () => {
  const [userState ,] = useRecoilState(userAuthState);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/users/user/memberships`,{
          headers:{
            Authorization:"Bearer " + localStorage.getItem("authToken")
          }
        });
        setClubs(response.data.clubs); // Assuming the API returns { clubs: Club[] }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load memberships");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);
  
  const handlePayFee = async (feeId: string, amount:Number ,type: string, description:string,clubId:string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/payments/create-order`,{
        name: description,
        amount: amount,
        userId: userState.userId,
        clubId,
        feeId,
      },{
        headers:{
          Authorization:"Bearer " + localStorage.getItem("authToken"),
        }
      })

      const order = response.data.razorpayOrder;

      const options = {
        key:"rzp_test_nStRSBBurtyWG7" ,
        amount: order.amount || 0, // Amount in paise
        currency: order.currency || "INR",
        name: type +" - "+  description,
        description:description ,
        image: "/logo.png", // Replace with your logo URL
        order_id: order.id, // Order ID from Razorpay
        handler: async (response: any) => {
          // Step 3: Verify payment on the backend
          try {
            await axios.post(`${BACKEND_URL}/api/v1/payments/verify-payment`, {
              feeId,
              paymentDetails: response,
            },{
              headers:{
                Authorization:"Bearer "+localStorage.getItem("authToken"),
              }
            });

            toast.success("Fee paid successfully!");
            // Update fee status locally
            setClubs((prev) =>
              prev.map((club) => ({
                ...club,
                fees: club.fees.map((fee) =>
                  fee.id === feeId ? { ...fee, status: "PAID" } : fee
                ),
              }))
            );
          } catch (error) {
            console.error("Payment verification failed", error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "John Doe", // Replace with user's name
          email: "john.doe@example.com", // Replace with user's email
          contact: "9876543210", // Replace with user's contact number
        },
        theme: {
          color: "#3399cc",
        },
      };

    // Step 4: Open Razorpay checkout
    const razorpay = new window.Razorpay(options);
    razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading memberships...</div>;
  }

  if (clubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-5 space-y-4 p-3 m-5 border border-slate-400 rounded-lg">
      <FaExclamationCircle className="text-4xl text-gray-500" /> {/* Icon */}
      <h2 className="text-lg font-semibold text-gray-800">
      You are not a member of any clubs yet
      </h2>
    </div>
    );
  }

  return (
    <div className="p-4">      
      <div className="">
        {clubs.map((club) => (
          <div
            key={club.id}
            className="border rounded-lg p-4 shadow-lg bg-white space-y-4"
          >
            <h2 className="text-xl font-semibold text-slate-800">{club.name}</h2>            
            <div className="text-sm text-gray-600">
              <p>
                <strong>Membership From:</strong>{" "}
                {new Date(club.joinedDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Membership Valid Till:</strong>{" "}
                {club.validTill
                  ? new Date(club.validTill).toLocaleDateString()
                  : "Lifetime"}
              </p>
            </div>
            {club.fees.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium mt-4 text-gray-800">
                  Pending Fees
                </h3>
                <ul className="space-y-4 mt-2">
                  {club.fees.map((fee) => (
                    <li
                      key={fee.id}
                      className={`border p-3 rounded shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between ${
                        fee.status === "OVERDUE"
                          ? "bg-red-50 border-red-200"
                          : fee.status === "PENDING"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-green-50 border-green-200"
                      }`}
                    >
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Type:</strong> {fee.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Type:</strong> {fee.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Amount:</strong> ₹{fee.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Due Date:</strong>{" "}
                          {new Date(fee.dueDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`font-semibold ${
                              fee.status === "OVERDUE"
                                ? "text-red-600"
                                : fee.status === "PENDING"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {fee.status}
                          </span>
                        </p>
                      </div>
                      {(fee.status === "PENDING" ||fee.status === "OVERDUE") && (
                        <button
                          onClick={() => handlePayFee(fee.id,fee.amount,fee.type,fee.description,club.id)}
                          className="mt-2 sm:mt-0 bg-blue-600 text-white py-1 px-3 rounded shadow hover:bg-blue-700"
                        >
                          Pay Fee
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-green-600 mt-2">No fees to be paid.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyClubMemberships;
