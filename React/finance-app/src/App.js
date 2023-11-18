import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Input,
  Checkbox,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import api from "./api";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    is_income: false,
    date: "",
  });
  const fetchTransactions = async () => {
    const response = await api.get("/transactions/");
    setTransactions(response.data);
  };

  console.log(formData);

  useEffect(() => {
    fetchTransactions();
  }, []);

  function handleInputChange(e) {
    const { name, type, value, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await api.post("/transactions/", formData);
    fetchTransactions();
    setFormData({
      amount: "",
      category: "",
      description: "",
      is_income: false,
      date: "",
    });
  };

  const isFormValid = () => {
    return (
      formData.amount &&
      formData.category &&
      formData.description &&
      formData.date
    );
  };

  return (
    <Flex flexDir="column">
      {/* Header */}
      <Flex
        w="100%"
        bgColor="#1789A3"
        h="80px"
        alignItems="center"
        borderBottomRadius="16px"
        boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.05)"
        paddingX="32px"
      >
        <Text color="white" fontSize="30px" fontWeight="600" lineHeight="36px">
          Finance App
        </Text>
      </Flex>

      {/* Form */}
      <Flex
        flexDir="column"
        gap="80px"
        padding="50px 16px 50px 16px"
        w="100%"
        h="100%"
        alignItems="center"
        justifyContent="center"
        overflowY="auto"
      >
        <Flex
          as="form"
          onSubmit={handleFormSubmit}
          maxWidth="380px"
          width="100%"
          flexDir="column"
          gap="24px"
        >
          <FormElement
            type="number"
            name="amount"
            title="Amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleInputChange}
          />
          <FormElement
            type="text"
            name="category"
            title="Category"
            placeholder="Category"
            value={formData.category}
            onChange={handleInputChange}
          />
          <FormElement
            type="text"
            name="description"
            title="Description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <CheckboxElement
            name="is_income"
            title="Is Income?"
            isChecked={formData.is_income}
            onChange={handleInputChange}
          />
          <FormElement
            type="date"
            name="date"
            title="Date"
            value={formData.date}
            onChange={handleInputChange}
          />
          <Button
            bgColor="#1789A3"
            color="white"
            _hover={{ opacity: "0.7" }}
            _active={{ opacity: "0.6" }}
            type="submit"
            isDisabled={!isFormValid()}
          >
            Submit
          </Button>
        </Flex>

        <TableContainer w="100%" maxWidth="1000px">
          <Table variant="simple">
            <TableCaption>Transaction History</TableCaption>
            <Thead>
              <Tr>
                <Th>Amount</Th>
                <Th>Category</Th>
                <Th>Description</Th>
                <Th>Type</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((transaction, index) => (
                <Tr key={index}>
                  <Td>{transaction.amount}</Td>
                  <Td>{transaction.category}</Td>
                  <Td>{transaction.description}</Td>
                  <Td>{transaction.is_income ? "Income" : "Expense"}</Td>
                  <Td>{transaction.date}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Flex>
  );
}

const FormElement = ({ type, name, title, placeholder, value, onChange }) => (
  <Flex flexDir="column" gap="8px">
    <Text fontWeight="500">{title}</Text>
    <Input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      h="40px"
      borderRadius="6px"
      border="1px solid #E2E8F0"
      color="black"
      _placeholder={{ color: "rgba(0, 0, 0, 0.36)" }}
    />
  </Flex>
);

const CheckboxElement = ({ name, title, isChecked, onChange }) => (
  <Flex alignItems="center" gap="16px">
    <Text>{title}</Text>
    <Checkbox name={name} isChecked={isChecked} onChange={onChange} />
  </Flex>
);

export default App;
