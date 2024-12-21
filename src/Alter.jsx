import React,{useState} from "react";
const initial = [
    {
      id: 118836,
      name: "Alyx",
      image: "https://avatar.iran.liara.run/public",
      balance: -7,
    }
  ];

const Button = ({children,onClick,type = "button"}) => {
    return(
       <button className="button" type={type} onClick={onClick}>{children}</button>
    )
}
export const Alter = () => {
    const [frds,setFrds] = useState(initial);
    const [showFrd,setShowFrd] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const handleShowFrd = () => {
        setShowFrd(!showFrd);
    } 

    const handleDelete = (id) => {
        const newFrds = frds.filter( (frd) => frd.id !== id);
        setFrds(newFrds);
        console.log(newFrds)
        setSelectedFriend(null)

    }

   const handleSelect = (friend) => {
    setSelectedFriend(cur => cur?.id === friend.id ? null : friend)
    //setSelectedFriend(friend);
    setShowFrd(false)
   }

    const handleAddFrd = (frd) => {
        setFrds(() => [...frds,frd]);
        console.log(frds);
    }
    function handleSplitBill(value) {
        setFrds((frds) =>
          frds.map((friend) =>
            friend.id === selectedFriend.id
              ? { ...friend, balance: friend.balance + value }
              : friend
          )
        );
    
        setSelectedFriend(null);
      }
    return(
        <>
            <div className="app">
                <div className="sidebar">
                    <FrdsList frds={frds}  setFrds={setFrds} onSelect={handleSelect}></FrdsList>
                    {showFrd && <AddFrd handleAdd={handleAddFrd}></AddFrd>}
                    <Button onClick={handleShowFrd}>{!showFrd ? 'AddFriend' : 'Close'}</Button>
                </div>
                { selectedFriend && <SplitBill SplitBill={handleSplitBill} handleDelete={handleDelete} selected={selectedFriend}></SplitBill> }
            </div>
        </>
    )
}

const FrdsList = ({frds,onSelect}) => {
    return(
        <ul>
            {
            frds.map((frd) => (
                <Frds frd={frd} onSelect={onSelect} ></Frds>
            ))
            }
        </ul>
    )
}

const Frds = ({frd,onSelect}) => {
    
    return(
        <>
            <li key={frd.id}>
                <img src={frd.image} alt={frd.name} />
                <h3>{frd.name}</h3>

            {frd.balance < 0 && (
            <p className="red">
            You owe {frd.name} {Math.abs(frd.balance)}€
            </p>
            )}
            {frd.balance > 0 && (
            <p className="green">
            {frd.name} owes you {Math.abs(frd.balance)}€
            </p>
            )}
            {frd.balance === 0 && <p>You and {frd.name} are even</p>}
                <Button onClick={() => onSelect(frd)}>Select</Button>
            </li>
        </>
    )
}

const AddFrd = ({handleAdd}) => {
    const [name,setName] = useState('');
    const [img,setImg] = useState('https://avatar.iran.liara.run/public');

    const handleName = (e) => {
        setName(e.target.value)
    }
    const handleImg = (e) => {
        setImg(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const id = crypto.randomUUID();
        if(!name || !img) return;

        const newFrd = {
            id,
            name,
            image:`${img}?=${id}`,
            balance:0,
        }
        handleAdd(newFrd);
        setName('')
    }
    
    return(
        <form className="add-frd" onSubmit={handleAdd}>
            <label>Friend Name :</label>
            <input type="text" value={name} onChange={handleName}/>
            <label>Image :</label>
            <input type="text" value={img} onChange={handleImg}/>
            <Button onClick={handleSubmit}>Add</Button>
        </form>
    )
}

const SplitBill = ({selected,handleDelete,SplitBill}) => {
    const [bill,setBill] = useState('');
    const [paidByUser, setPaidByUser] = useState("");
    const [whoIsPaying,setWhoIsPaying] = useState('user');

    const paidByFrd = bill ? bill - paidByUser : "" ;

    const handleBill = (e) => {
        setBill(e.target.value)
    }
    const handleIsPaying = (e) => {
        setWhoIsPaying(e.target.value);
    }
    const onSubmit = (e) =>{
        e.preventDefault();
        handleDelete();
        if (!bill || !paidByUser) return;
        SplitBill(whoIsPaying === "user" ? paidByFrd : -paidByUser);
        
    }

    return(
        <form className="form-split-bill" onSubmit={onSubmit}>
            <h1>SPLIT A BILL WITH {selected.name}</h1>
            <div>

            <label>Bill value</label>
            <input type="text" onChange={handleBill} value={bill}/>

            <label>Your Expense</label>
            <input type="text" value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }/>

            <label>Friend Expense</label>
            <input type="text" readOnly value={paidByFrd}/>

            <label>Who is paying bill</label>
            <select value={whoIsPaying} onChange={handleIsPaying}>
                <option value="user">You</option>
                <option  value={selected.name}>{selected.name}</option>
            </select> 
            </div>
            <Button>Split</Button>
            <Button onClick={() => handleDelete(selected.id)}>Delete</Button>
        </form>
    )
}