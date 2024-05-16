import { useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { useFinancialRecords } from "../../contexts/financial-record-context"

export const FinancialRecordForm = () => {
    const [description, setDescription] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [category, setCategory] = useState<string>("")
    const [paymentMethod, setPaymentMethod] = useState<string>("")
    const { addRecord } = useFinancialRecords()

    const { user } = useUser();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const newRecord = {
            userId: user?.id ?? '',
            date: new Date(),
            description: description,
            amount: parseFloat(amount),
            category: category,
            paymentMethod: paymentMethod
        }

        addRecord(newRecord)
        setDescription("")
        setAmount("")
        setCategory("")
        setPaymentMethod("")
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label>Description:</label>
                    <input className="input" type="text" onChange={(e) => setDescription(e.target.value)} value={description} required />
                </div>
                <div className="form-field">
                    <label>Amount:</label>
                    <input className="input" type="number" onChange={(e) => setAmount(e.target.value)} value={amount} required />
                </div>
                <div className="form-field">
                    <label>Category:</label>
                    <select className="input" onChange={(e) => setCategory(e.target.value)} value={category} required>
                        <option value={""}>Select a category</option>
                        <option value={"Food"}>Food</option>
                        <option value={"Rent"}>Rent</option>
                        <option value={"Salary"}>Salary</option>
                        <option value={"Utilities"}>Utilities</option>
                        <option value={"Entertainment"}>Entertainment</option>
                        <option value={"Other"}>Other</option>
                    </select>
                </div>
                <div className="form-field">
                    <label>Payment Method:</label>
                    <select className="input" onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} required>
                        <option value={""}>Select a payment method</option>
                        <option value={"Credit Card"}>Credit Card</option>
                        <option value={"Cash"}>Cash</option>
                        <option value={"Bank Transfer"}>Bank Transfer</option>
                    </select>
                </div>
                <button className="button" type="submit">Add Record</button>
            </form>
        </div>
    )
}