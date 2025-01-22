import React, { Component } from "react";
import DataTable from "react-data-table-component";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";
import "./App.css";
import { Navigate } from "react-router-dom";

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: localStorage.getItem("adminLoggedIn") === "true", // Check login status
      insertItemData: { name: "", price: "",  description: "", img: null },
      submittedData: [],
      signupData: [],
      placedOrderData: [],
      insertTabData:[],
      contactSearchQuery: "",
      signupSearchQuery: "",
      placedOrderSearchQuery: "",
      insertSearchQuery: "",
      loading: false,
      activeTab: "signup", // Default tab,
      showCart: null,
      isUpdate: false, // Track if it's an update
      selectedItemId: null, // Store the ID of the item to be updated
      isUpdate: false,
      updateItemId: null,
      filterStatus: "All",
      selectedStatusFilter: "All", 
      
    };
  }
  handleFilterChange = (status) => {
    this.setState({ filterStatus: status });
  };

  filterRows = (rows) => {
    const { filterStatus } = this.state;
    if (filterStatus === "All") return rows; // Show all rows if "All" is selected
    return rows.filter((row) => row.status === filterStatus);
  };
  handleStatusFilterChange = (e) => {
    // Update the selected status filter when the user selects a new option
    this.setState({ selectedStatusFilter: e.target.value });
  };


  toggleCartDetails = (index) => {
    this.setState((prevState) => ({
      showCart: prevState.showCart === index ? null : index,
    }));
  };

  // Fetch data from the API
  fetchData = async () => {
    this.setState({ loading: true });
    try {
      const contactResponse = await fetch("http://localhost:5000/data");
      const signupResponse = await fetch("http://localhost:5000/signupdata");
      const placedOrderResponse = await fetch("http://localhost:5000/placedorders");
      const insertResponse = await fetch("http://localhost:5000/items-fetch");
  
      if (
        !contactResponse.ok ||
        !signupResponse.ok ||
        !placedOrderResponse.ok ||
        !insertResponse.ok
      ) {
        throw new Error(
          `HTTP error! Status: ${contactResponse.status} ${signupResponse.status} ${placedOrderResponse.status} ${insertResponse.status}`
        );
      }
  
      const contactData = await contactResponse.json();
      const signupData = await signupResponse.json();
      const placedOrderData = await placedOrderResponse.json();
      const insertTabData = await insertResponse.json();
  
      console.log('Fetched data:', { contactData, signupData, placedOrderData, insertTabData });
  
      this.setState({
        submittedData: contactData,
        signupData: signupData.data || [],
        placedOrderData: placedOrderData.data || [],
        insertTabData: insertTabData.data || [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.setState({ loading: false });
    }
  };
  

  componentDidMount() {
    this.fetchData();
    this.intervalId = setInterval(this.fetchData, 9000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleSearchQueryChange = (e, type) => {
    const query = e.target.value.toLowerCase();
    if (type === "contact") {
      this.setState({ contactSearchQuery: query });
    } else if (type === "signup") {
      this.setState({ signupSearchQuery: query });
    } else if (type === "placedOrder") {
      this.setState({ placedOrderSearchQuery: query });
    } else if (type === "insert") {
      this.setState({ insertSearchQuery: query });
    }
  };
  
  

  handleExportData = (data) => {
    switch (this.state.activeTab) {
      case "contact":
        return data.map(item => ({
          Name: item.name || "N/A",
          Email: item.email || "N/A",
          Contact:item.contact||"N/A",
          Message: item.message || "N/A",
        }));
      case "signup":
        return data.map(item => ({
          FirstName: item.firstname || "N/A",
          LastName: item.lastname || "N/A",
          Email: item.email || "N/A",
        }));
      case "placedOrder":
        return data.map(item => ({
          FirstName: item.firstname || "N/A",
          LastName: item.lastname || "N/A",
          Address: item.address || "N/A",
          Town: item.town || "N/A",
          Postcode: item.postcode || "N/A",
          Mobile: item.mobile || "N/A",
          Email: item.email || "N/A",
          DeliveryDate: item.delivery_date || "N/A",
        }));
        case "insert":
      return data.map(item => ({
        Name: item.name || "N/A",
        Price: item.price || "N/A",
        Description: item.description || "N/A",
      }));
      default:
        return [];
    }
  };

  handleExportCSV = (data) => {
    return this.handleExportData(data);
  };

  handleExportExcel = (data) => {
    const filteredData = this.handleExportData(data);
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, "data.xlsx");
  };

  handleExportPDF = (data) => {
    const doc = new jsPDF();
    const columns = Object.keys(this.handleExportData(data)[0]); // Dynamically get column names
    const rows = this.handleExportData(data).map(item =>
      Object.values(item) // Dynamically get values for each row
    );

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save("table.pdf");
  };

  handleTabClick = (tabName) => {
    this.setState({ activeTab: tabName });
  };
  
  handleInsertItemChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      const previewURL = URL.createObjectURL(file);
      this.setState({ insertItemData: { ...this.state.insertItemData, img: file, previewURL } });
    }
    else {
      // Parse the price as a float if the field is 'price'
      const newValue = name === "price" ? parseFloat(value) : value;
      this.setState({ insertItemData: { ...this.state.insertItemData, [name]: newValue } });
    }
  };

  handleInsertItemSubmit = async (e) => {
    e.preventDefault();
    
    const { name, price, description, img } = this.state.insertItemData;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    
    if (img) {
      formData.append("img", img); // Use img directly if it's a file
    }


    
    const url = this.state.isUpdate
      ? `http://localhost:5000/update-item/${this.state.updateItemId}`
      : `http://localhost:5000/insert-item`;
    
    const method = this.state.isUpdate ? 'PUT' : 'POST';  // Use POST for insert
    
    try {
      const response = await fetch(url, {
        method: method, // Use POST for insert and PUT for update
        body: formData,
      });
  
      if (response.ok) {
        alert(this.state.isUpdate ? "Item successfully updated!" : "Item successfully inserted!");
        this.setState({
          insertItemData: { name: "", price: "", description: "", img: null }, // Reset the form
          isUpdate: false, // Reset update mode
        });
      } else {
        alert("Failed to submit item!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  
  handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:5000/delete-item/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        const result = await response.json();
        alert("Item deleted successfully!");
        this.setState((prevState) => ({
          insertTabData: prevState.insertTabData.filter((item) => item.id !== id),
        }));
      } else {
        throw new Error(`Failed to delete item: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("There was an error deleting the item.");
    }
  };

  
  handleUpdate = (row) => {
    // Set the form data with the selected row's values
    this.setState({
      insertItemData: {
        name: row.name,
        price: row.price,
        description: row.description,
        previewURL: row.img ? row.img : null, // Set image preview if present
      },
      isUpdate: true, // Switch to update mode
      updateItemId: row.id, // Store the item's ID for updating
    });
  
    // Optionally, scroll to the form (if desired)
    window.scrollTo(0, 0);
  };
  handleResetForm = () => {
    this.setState({
      insertItemData: { name: "", price: "", description: "", img: null, previewURL: "" },
      isUpdate: false,
      updateItemId: null,
    });
  };

  
  

  
  
  render() {
    const {
      isLoggedIn,
      submittedData,
      signupData,
      placedOrderData,
      contactSearchQuery,
      signupSearchQuery,
      placedOrderSearchQuery,
      loading,
      activeTab,
      insertItemData,
      insertTabData,
      updateItemId,
      selectedStatusFilter, // Selected status filter

    } = this.state;

    if (!isLoggedIn) {
      return <Navigate to="/" />;
    }
    const submitButtonText = this.state.isUpdate ? "Update Item" : "Insert Item";


    const tabs = [
      { name: "Contact", key: "contact" },
      { name: "Signup", key: "signup" },
      { name: "Placed Orders", key: "placedOrder" },
      { name: "Insert Item", key: "insert" },
    ];

    const filteredContactData = submittedData.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(contactSearchQuery)
    );

    const filteredSignupData = signupData.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(signupSearchQuery)
    );

    const filteredPlacedOrderData = placedOrderData
    .filter((item) => {
      // Filter by search query
      return Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(placedOrderSearchQuery.toLowerCase());
    })
    .filter((item) => {
      // Filter by status
      if (selectedStatusFilter === "All") {
        return true; // Show all statuses
      }
      return item.status === selectedStatusFilter; // Filter by selected status
    });

    const filteredInsertData = insertTabData.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(this.state.insertSearchQuery)
    );
  


    const columns = {
      contact: [
        { name: "Name", selector: (row) => row?.name || "N/A", sortable: true },
        { name: "Email", selector: (row) => row?.email || "N/A", sortable: true },
        { name: "Contact", selector: (row) => row?.contact || "N/A", sortable: true },
        { name: "Message", selector: (row) => row?.message || "N/A", sortable: true },
      ],
      signup: [
        { name: "First Name", selector: (row) => row?.firstname || "N/A", sortable: true },
        { name: "Last Name", selector: (row) => row?.lastname || "N/A", sortable: true },
        { name: "Email", selector: (row) => row?.email || "N/A", sortable: true },
      ],
      placedOrder:  [
        { name: "First Name", selector: (row) => row?.firstname || "N/A", sortable: true },
        { name: "Last Name", selector: (row) => row?.lastname || "N/A", sortable: true },
        { name: "Address", selector: (row) => row?.address || "N/A", sortable: true },
        { name: "Town", selector: (row) => row?.town || "N/A", sortable: true },
        { name: "Postcode", selector: (row) => row?.postcode || "N/A", sortable: true },
        { name: "Mobile", selector: (row) => row?.mobile || "N/A", sortable: true },
        { name: "Email", selector: (row) => row?.email || "N/A", sortable: true },
        { name: "Delivery Date", selector: (row) => row?.delivery_date || "N/A", sortable: true },
        {
          name: "Cart Items",
selector: (row) => row?.cart_items,
cell: (row, rowIndex) => (
  <>
    <button
      onClick={() => this.toggleCartDetails(rowIndex)} // Use `this.toggleCartDetails` directly
      style={{
        padding: "10px",
        backgroundColor: this.state.showCart === rowIndex ? "red" : "green", // Green for cart, Red for close
        color: "white",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // Centers the icon
        borderRadius: "8px", // Optional: rounded button for modern look
      }}
    >
      {/* Green Cart Icon or Red Cross Icon */}
      {this.state.showCart === rowIndex ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="white" // White color for the cross
          className="size-6"
          style={{
            width: "20px",
            height: "20px",
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
          style={{
            width: "20px",
            height: "20px",
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
      )}
    </button>

    {/* Modal to show cart details when clicked */}
    {this.state.showCart === rowIndex && (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          width: "80%",
          maxWidth: "600px",
          borderRadius: "8px",
          overflowY: "auto",
          maxHeight: "80vh",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Cart Items</h3>
        <div
          style={{
            marginBottom: "15px",
            fontWeight: "bold",
            fontSize: "1.2rem",
            borderTop: "2px solid #ccc",
            paddingTop: "10px",
            textAlign: "center",
          }}
        >
          Total Cost: ${row.cart_items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
        </div>
        {row.cart_items.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              padding: "10px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div style={{ width: "40%", wordWrap: "break-word" }}>
              {item.name}, {item.quantity}
            </div>
            <div style={{ width: "20%", textAlign: "center" }}>
              ${item.price.toFixed(2)}
            </div>
            <div style={{ width: "20%", textAlign: "center" }}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    )}
  </>
),
sortable: true,



        },
        
    {
      name: "Status",
      selector: (row) => row?.status || "N/A",
      sortable: true,
      cell: (row) => (
        <select
          value={row?.status || "Not Delivered"}
          className="p-2 border rounded"
          disabled={row.status === "Delivered" || row.status === "Cancelled"} 
          onChange={async (e) => {
            const newStatus = e.target.value;

            if (newStatus === "Delivered" && row.status !== "Delivered") {
              try {
                const response = await fetch(`http://localhost:5000/update-deli`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: row.id,
                    status: "Delivered",
                  }),
                });

                if (response.ok) {
                  console.log("Status updated successfully");
                } else {
                  console.log("Failed to update status", response.status);
                }
              } catch (error) {
                console.error("Error during API request", error);
              }
            }
          }}
        >
          <option value="Not Delivered">Not Delivered</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      ),
    },
        
        
      ],

      insert: [
        { name: "Name", selector: (row) => row?.name || "N/A", sortable: true },
        { name: "Price", selector: (row) => row?.price || "N/A", sortable: true },
        // { name: "Category", selector: (row) => row?.category || "N/A", sortable: true },
        { name: "Description", selector: (row) => row?.description || "N/A", sortable: true },
        {
          name: 'Image',
          cell: (row) =>
            row.img ? (
              <img
                src={row.img}  
                width="100"
                height="100"
                style={{ objectFit: "cover" }}  // Optional: ensures the image covers the area
              />
            ) : (
              'No Image'
            ),
        },
        {
          name: "Actions",
          cell: (row) => (
            <div>

<button
                onClick={() => this.handleUpdate(row)}
                className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Update
              </button>
              <button
                onClick={() => this.handleDelete(row.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Delete
              </button>
            </div>
          ),
        }
        
        
        
        
      ],
    };
   
    
    
    
    const activeData =
      activeTab === "contact"
        ? filteredContactData
        : activeTab === "signup"
        ? filteredSignupData
        : activeTab === "placedOrder"
        ? filteredPlacedOrderData
        : activeTab === "insert"
        ? filteredInsertData
        : [];
        const conditionalRowStyles = [
          {
            when: (row) => row.status === " Not Delivered",
            style: {
              backgroundColor: "lightgreen",
            },
          },
          {
            when: (row) => row.status === "Cancelled",
            style: {
              backgroundColor: "lightcoral",
            },
          },
        ];



//     return (
//       <div className="p-6">
//         {loading && <p>Loading...</p>}
//         <div className="d-flex mb-4">
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => this.handleTabClick(tab.key)}
//               className={`px-4 py-2 border ${activeTab === tab.key ? "bg-green-500 text-white" : ""}`}
//             >
//               {tab.name}
//             </button>
//           ))}
//         </div>
        

//         {activeTab === "insert" && (
//         <>
//           <form
//             onSubmit={this.handleInsertItemSubmit}
//             className="mb-4"
//           >
//             <div className="mb-2">
//               <label>Item Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={insertItemData.name}
//                 onChange={this.handleInsertItemChange}
//                 className="px-4 py-2 border rounded w-full"
//                 required
//               />
//             </div>
//             <div className="mb-2">
//               <label>Price</label>
//               <input
//                 type="number"
//                 name="price"
//                 value={insertItemData.price}
//                 onChange={this.handleInsertItemChange}
//                 className="px-4 py-2 border rounded w-full"
//                 required
//               />
//             </div>
//             <div className="mb-2">
//               <label>Description</label>
//               <textarea
//                 name="description"
//                 value={insertItemData.description}
//                 onChange={this.handleInsertItemChange}
//                 className="px-4 py-2 border rounded w-full"
//                 required
//               />
//             </div>
//             <div className="mb-2">
//               <label>Image</label>
//               <input
//                 type="file"
//                 name="img"
//                 onChange={this.handleInsertItemChange}
//                 className="px-4 py-2 border rounded w-full"
//               />
//             </div>
//             {insertItemData.previewURL && (
//               <div className="image-preview">
//                 <img
//                   src={insertItemData.previewURL}
//                   alt="Preview"
//                   style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px" }}
//                 />
//               </div>
//             )}
//             <div class="flex justify-center space-x-4 mt-6">
//   <button
//     type="submit"
//     class="bg-green-500 text-white px-4 py-2 rounded"
//   >
//     {submitButtonText}
//   </button>
//   <button
//     type="button"
//     onClick={this.handleResetForm}
//     class="bg-green-500 text-white px-4 py-2 rounded"
//   >
//     Reset
//   </button>
// </div>

//           </form>
//         </>
//       )}

//         {/* Search functionality */}
//         <input
//           type="text"
//           placeholder={`Search ${activeTab} Data...`}
//           value={
//             activeTab === "contact"
//               ? contactSearchQuery
//               : activeTab === "signup"
//               ? signupSearchQuery
//               : placedOrderSearchQuery
//           }
//           onChange={(e) => this.handleSearchQueryChange(e, activeTab)}
//           className="mb-4 px-4 py-2 border rounded w-full"
//         />

//         {/* Export buttons */}
//         <div className="mb-4">
//           <button
//             onClick={() => this.handleExportPDF(activeData)}
//             className="mr-2 bg-green-500 text-white px-4 py-2 rounded"
//           >
//             Export PDF
//           </button>
//           <button
//             onClick={() => this.handleExportExcel(activeData)}
//             className="mr-2 bg-green-500 text-white px-4 py-2 rounded"
//           >
//             Export Excel
//           </button>
//           <CSVLink
//             data={this.handleExportCSV(activeData)}
//             filename={`${activeTab}.csv`}
//             className="mr-2 bg-green-500 text-white px-4 py-2 rounded no-underline"
//           >
//             Export CSV
//           </CSVLink>
//         </div>
//         <div className="p-6">
//   {/* Conditionally render the Filter for Status based on activeTab */}
//   {activeTab === "placedOrder" && (
//     <div className="mb-4">
//       <label className="mr-2">Filter by Status:</label>
//       <select
//         value={selectedStatusFilter}
//         onChange={this.handleStatusFilterChange}
//         className="p-2 border rounded"
//       >
//         <option value="All">All</option>
//         <option value=" Not Delivered">Not Delivered</option>
//         <option value="Delivered">Delivered</option>
//         <option value="Cancelled">Cancelled</option>
//       </select>
//     </div>
//   )}
// </div>


        
        

        
// <div className="p-6">
//   {/* Conditionally render DataTable based on activeTab */}
//   {activeTab === "placedOrder" ? (
//     <DataTable
//       columns={columns["placedOrder"]}
//       data={filteredPlacedOrderData}
//       conditionalRowStyles={conditionalRowStyles}
//       pagination
//       highlightOnHover
//       striped
//       paginationPerPage={10}
//     />
//   ) : (
//     <DataTable
//       columns={columns[activeTab]}
//       data={activeData}
//       pagination
//       highlightOnHover
//       striped
//       paginationPerPage={10}
//     />
//   )}
// </div>

//       </div>
//     );
return (
  <div className="p-6 bg-gray-100 min-h-screen">
    {loading && <p className="text-center text-gray-500">Loading...</p>}

    {/* Tabs */}
    <div className="flex space-x-4 mb-6 border-b-2 pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => this.handleTabClick(tab.key)}
          className={`px-6 py-2 font-medium text-sm rounded-t-lg border-b-4 ${
            activeTab === tab.key
              ? "border-green-500 text-green-600"
              : "border-transparent text-gray-500 hover:text-green-600"
          }`}
        >
          {tab.name}
        </button>
      ))}
    </div>

    {/* Form for Insert Tab */}
    {activeTab === "insert" && (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={this.handleInsertItemSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              name="name"
              value={insertItemData.name}
              onChange={this.handleInsertItemChange}
              className="px-4 py-2 border rounded w-full focus:ring-2 focus:ring-green-300 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={insertItemData.price}
              onChange={this.handleInsertItemChange}
              className="px-4 py-2 border rounded w-full focus:ring-2 focus:ring-green-300 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={insertItemData.description}
              onChange={this.handleInsertItemChange}
              className="px-4 py-2 border rounded w-full focus:ring-2 focus:ring-green-300 focus:outline-none"
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              name="img"
              onChange={this.handleInsertItemChange}
              className="px-4 py-2 border rounded w-full focus:ring-2 focus:ring-green-300 focus:outline-none"
            />
          </div>
          {insertItemData.previewURL && (
            <div className="mt-4">
              <img
                src={insertItemData.previewURL}
                alt="Preview"
                className="w-full max-w-xs mx-auto rounded-lg shadow-md"
              />
            </div>
          )}
          <div className="flex justify-center space-x-4">
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600">
              {submitButtonText}
            </button>
            <button
              type="button"
              onClick={this.handleResetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    )}

    {/* Search and Export Section */}
    <div className="flex flex-wrap items-center justify-between mb-6">
      <input
        type="text"
        placeholder={`Search ${activeTab} Data...`}
        value={
          activeTab === "contact"
            ? contactSearchQuery
            : activeTab === "signup"
            ? signupSearchQuery
            : placedOrderSearchQuery
        }
        onChange={(e) => this.handleSearchQueryChange(e, activeTab)}
        className="mb-2 px-4 py-2 border rounded w-full md:w-1/3 focus:ring-2 focus:ring-green-300 focus:outline-none"
      />
      <div className="flex space-x-4">
        <button
          onClick={() => this.handleExportPDF(activeData)}
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
        >
          Export PDF
        </button>
        <button
          onClick={() => this.handleExportExcel(activeData)}
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
        >
          Export Excel
        </button>
        <CSVLink
          data={this.handleExportCSV(activeData)}
          filename={`${activeTab}.csv`}
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 no-underline"
        >
          Export CSV
        </CSVLink>
      </div>
    </div>

   
    {/* {activeTab === "placedOrder" && (
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Filter by Status:</label>
        <select
          value={selectedStatusFilter}
          onChange={this.handleStatusFilterChange}
          className="p-2 border rounded w-full md:w-1/3 focus:ring-2 focus:ring-green-300 focus:outline-none"
        >
          <option value="All">All</option>
          <option value=" Not Delivered">Not Delivered</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    )}

   
    <div className="p-6 bg-white rounded-lg shadow-md">
      {activeTab === "placedOrder" ? (
        <DataTable
          columns={columns["placedOrder"]}
          data={filteredPlacedOrderData}
          conditionalRowStyles={conditionalRowStyles}
          pagination
          highlightOnHover
          striped
          paginationPerPage={10}
          className="rounded-lg"
        />
      ) : (
        <DataTable
          columns={columns[activeTab]}
          data={activeData}
          pagination
          highlightOnHover
          striped
          paginationPerPage={10}
          className="rounded-lg"
        />
      )} */}
     {activeTab === "placedOrder" && (
  <div className="mb-8">      
      {/* Status Filter with Default "Filter All" Option */}
      <div>
        <select
          value={selectedStatusFilter}
          onChange={this.handleStatusFilterChange}
          className="p-2 border rounded w-full md:w-1/3 focus:ring-2 focus:ring-green-300 focus:outline-none"
        >
          <option value="All">All</option>
          <option value=" Not Delivered">Not Delivered</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>
)}

{/* DataTable Section */}
<div className="p-6 bg-white rounded-lg shadow-md">
  {activeTab === "placedOrder" ? (
    <DataTable
      columns={columns["placedOrder"]}
      data={filteredPlacedOrderData}
      conditionalRowStyles={conditionalRowStyles}
      pagination
      highlightOnHover
      striped
      paginationPerPage={10}
      className="rounded-lg"
    />
  ) : (
    <DataTable
      columns={columns[activeTab]}
      data={activeData}
      pagination
      highlightOnHover
      striped
      paginationPerPage={10}
      className="rounded-lg"
    />
  )}


    </div>
  </div>
);

  }
}

export default AdminDashboard;
