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
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from "@chakra-ui/react";
import api from "./api";

function App() {
  const [transactions, setTransactions] = useState([]);
  const toast = useToast();
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    is_income: false,
    date: "",
  });
  const [removeDescription, setRemoveDescription] = useState("");

  const fetchTransactions = async () => {
    const response = await api.get("/transactions/");
    setTransactions(response.data);
  };

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
    toast({
      title: "Success",
      description: "Transaction added",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleRemoveTransaction = async (e) => {
    e.preventDefault();
    try {
      await api.delete("/transactions/", {
        params: { description: removeDescription },
      });
      fetchTransactions();
      toast({
        title: "Success",
        description: "Transaction removed",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove transaction",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setRemoveDescription("");
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

      <Tabs isFitted variant="enclosed" mt="6">
        <TabList mb="1em">
          <Tab>Add Transaction</Tab>
          <Tab>Remove Transaction</Tab>
        </TabList>
        <TabPanels>
          <TabPanel display="flex" justifyContent="center" w="100%">
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
                _hover={
                  isFormValid() ? { bgColor: "#007D99" } : { opacity: "0.3" }
                }
                _active={
                  isFormValid() ? { bgColor: "#00576B" } : { opacity: "0.2" }
                }
                type="submit"
                isDisabled={!isFormValid()}
              >
                Submit
              </Button>
            </Flex>
          </TabPanel>
          <TabPanel display="flex" justifyContent="center" w="100%">
            <Flex
              as="form"
              onSubmit={handleRemoveTransaction}
              maxWidth="380px"
              width="100%"
              flexDir="column"
              gap="24px"
            >
              <FormElement
                type="text"
                name="removeDescription"
                title="Remove Description"
                placeholder="Enter description to remove"
                value={removeDescription}
                onChange={(e) => setRemoveDescription(e.target.value)}
              />
              <Button
                bgColor="#1789A3"
                color="white"
                _hover={{ bgColor: "#007D99" }}
                _active={{ bgColor: "#00576B" }}
                type="submit"
                isDisabled={!removeDescription}
              >
                Remove Transaction
              </Button>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <TableContainer w="100%" justifyContent="center" my="80px" display="flex">
        <Table variant="simple" maxWidth="1000px">
          <TableCaption>Transaction History</TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
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
                <Td>{transaction.id}</Td>
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
