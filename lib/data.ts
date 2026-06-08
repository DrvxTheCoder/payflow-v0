export type TxStatus = "Received" | "Sent" | "Payment"

export type Transaction = {
  id: string
  name: string
  account: string
  date: string
  status: TxStatus
  amount: number
  avatar?: string
  brand?: "segment" | "focalpoint" | "biosyntesis" | "galileo"
}

export const transactions: Transaction[] = [
  {
    id: "1",
    name: "Segment LLC",
    account: "#42148930",
    date: "22 July 2024, 16:43",
    status: "Received",
    amount: 200,
    brand: "segment",
  },
  {
    id: "2",
    name: "Kari Rasmussen",
    account: "#42142456",
    date: "21 July 2024, 12:22",
    status: "Sent",
    amount: -20,
    avatar: "/avatars/kari.png",
  },
  {
    id: "3",
    name: "FocalPoint",
    account: "#22242442",
    date: "21 July 2024, 11:38",
    status: "Payment",
    amount: -25,
    brand: "focalpoint",
  },
  {
    id: "4",
    name: "Nataly Craig",
    account: "#55348123",
    date: "21 July 2024, 10:22",
    status: "Received",
    amount: 200,
    avatar: "/avatars/nataly.png",
  },
  {
    id: "5",
    name: "Lucy Jones",
    account: "#21248532",
    date: "20 July 2024, 16:43",
    status: "Received",
    amount: 100,
    avatar: "/avatars/lucy.png",
  },
  {
    id: "6",
    name: "Alec Dawson",
    account: "#42148555",
    date: "20 July 2024, 18:43",
    status: "Sent",
    amount: -64,
    avatar: "/avatars/alec.png",
  },
  {
    id: "7",
    name: "Kelly Williams",
    account: "#42121930",
    date: "19 July 2024, 20:22",
    status: "Sent",
    amount: -120,
    avatar: "/avatars/kelly.png",
  },
  {
    id: "8",
    name: "BioSyntesis",
    account: "#86548432",
    date: "18 July 2024, 17:43",
    status: "Payment",
    amount: -32,
    brand: "biosyntesis",
  },
  {
    id: "9",
    name: "Galileo",
    account: "#28748123",
    date: "17 July 2024, 13:24",
    status: "Payment",
    amount: -9,
    brand: "galileo",
  },
]

export const recentContacts = [
  { name: "Nadia", avatar: "/avatars/contact1.png" },
  { name: "Elena", avatar: "/avatars/contact2.png" },
  { name: "Mia", avatar: "/avatars/contact3.png" },
  { name: "Nataly", avatar: "/avatars/nataly.png" },
  { name: "Marcus", avatar: "/avatars/robert.png" },
]

export const expensesData = [
  { month: "Jan", value: 9200 },
  { month: "Feb", value: 8400 },
  { month: "Mar", value: 10100 },
  { month: "Apr", value: 12243 },
  { month: "May", value: 7600 },
  { month: "Jun", value: 11800 },
]

export const incomeData = [
  { month: "Jan", value: 11200 },
  { month: "Feb", value: 9800 },
  { month: "Mar", value: 13400 },
  { month: "Apr", value: 16243 },
  { month: "May", value: 8900 },
  { month: "Jun", value: 10200 },
]
