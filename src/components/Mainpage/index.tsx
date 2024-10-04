import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  useColorMode,
  useColorModeValue,
  IconButton,
  VStack,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import car6 from "../../assets/slide_1-1.jpg";
import car7 from "../../assets/slide_2-1-1.jpg";
import car8 from "../../assets/slide_3-1-1.jpg";
import { useNavigate } from 'react-router-dom';
import { LineScalePulseOut } from 'react-pure-loaders';

// Define interfaces for type safety
interface CarMake {
  makeName: string;
  dateCreated: string;
}

interface CarBrandEntry {
  brandName: string;
  makes: CarMake[];
}

const CarRental: React.FC = () => {
  const { toggleColorMode } = useColorMode();

  // Color and theme configurations
  const brandColor = useColorModeValue('gray.800', 'gray.200');
  const bgGradient = useColorModeValue('linear(to-r, teal.600, blue.700)', 'linear(to-r, gray.900, blackAlpha.900)');
  const color = useColorModeValue('#319795', '#81E6D9');
  const navigate = useNavigate();
  const toast = useToast(); // Initialize toast for notifications

  const handleNavigate = () => {
    navigate('/RoadPage');
  }

  const carImages = [
    { src: car6, message: 'Innovation meets elegance' },
    { src: car7, message: 'Drive into the future with style' },
    { src: car8, message: 'Luxury redefined for every destination' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [brands, setBrands] = useState<string[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [isLoadingMakes, setIsLoadingMakes] = useState<boolean>(false); // Loading state

  // Initialize tableData from Local Storage or default to empty array
  const [tableData, setTableData] = useState<CarBrandEntry[]>(() => {
    const savedData = localStorage.getItem('carRentalTableData');
    return savedData ? JSON.parse(savedData) : [];
  });

  // Sync tableData with Local Storage whenever it changes
  useEffect(() => {
    localStorage.setItem('carRentalTableData', JSON.stringify(tableData));
  }, [tableData]);

  // Function to cycle through images and messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carImages.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, [carImages.length]);

  // Fetch car brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Car/CarBrands');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setBrands(data.map((brand: { brandName: string }) => brand.brandName));
        toast({
          title: "Brands Loaded",
          description: "Car brands fetched successfully.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error fetching brands:', error);
        toast({
          title: "Error",
          description: "Failed to fetch car brands. Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchBrands();
  }, [toast]);

  // Handle brand selection and fetch corresponding makes
  const handleBrandChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    setSelectedMake(''); // Clear makes when brand changes
    setIsLoadingMakes(true); // Start Loading

    if (brand) {
      try {
        const fetchMakes = await fetch(`http://localhost:5000/api/Car/CarModels?BrandName=${brand}`);
        if (!fetchMakes.ok) throw new Error('Failed to fetch makes');
        const data = await fetchMakes.json();
        setMakes(data.map((make: { carMake: string }) => make.carMake));
        toast({
          title: "Makes Loaded",
          description: `Car makes for ${brand} fetched successfully.`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error(`Error fetching makes for brand ${brand}:`, error);
        toast({
          title: "Error",
          description: "Failed to fetch car makes. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoadingMakes(false);
      }
    } else {
      setMakes([]);
      setIsLoadingMakes(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedBrand && selectedMake) {
      const currentDate = new Date().toLocaleString();

      // Data for the Submit API
      const dataSubmit = {
        BrandName: selectedBrand,
        MakeName: selectedMake,
      };

      // Data for the Display API
      const dataDisplay = {
        CarBrand: selectedBrand,
        CarMake: selectedMake,
      };

      try {
        // First POST request to Submit API
        const responseSubmit = await fetch('http://localhost:5000/api/Car/Submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataSubmit),
        });

        if (!responseSubmit.ok) {
          const errorMessage = await responseSubmit.text(); // Get the response as text
          throw new Error(errorMessage || 'Failed to submit to Submit API');
        }

        const resultSubmitText = await responseSubmit.text(); // Get response as text

        let resultSubmit;
        try {
          resultSubmit = JSON.parse(resultSubmitText); // Attempt to parse as JSON
        } catch {
          resultSubmit = { message: resultSubmitText }; // If parsing fails, use the raw text
        }

        // Second POST request to Display API
        const responseDisplay = await fetch('http://localhost:5000/api/Car/Display', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataDisplay),
        });

        if (!responseDisplay.ok) {
          const errorMessage = await responseDisplay.text();
          throw new Error(errorMessage || 'Failed to submit to Display API');
        }

        const resultDisplayText = await responseDisplay.text();

        let resultDisplay;
        try {
          resultDisplay = JSON.parse(resultDisplayText);
        } catch {
          resultDisplay = { message: resultDisplayText };
        }

        // Show success toast
        toast({
          title: "Submission Successful",
          description: resultSubmit.message || "Your selection has been submitted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Update tableData state
        setTableData(prevData => {
          const brandIndex = prevData.findIndex(entry => entry.brandName === selectedBrand);
          if (brandIndex !== -1) {
            const makeExists = prevData[brandIndex].makes.some(make => make.makeName === selectedMake);
            if (!makeExists) {
              const updatedData = [...prevData];
              updatedData[brandIndex].makes.push({
                makeName: selectedMake,
                dateCreated: currentDate,
              });
              return updatedData;
            } else {
              toast({
                title: "Duplicate Entry",
                description: "This make already exists under the selected brand.",
                status: "warning",
                duration: 3000,
                isClosable: true,
              });
              return prevData;
            }
          } else {
            return [
              ...prevData,
              {
                brandName: selectedBrand,
                makes: [
                  {
                    makeName: selectedMake,
                    dateCreated: currentDate,
                  },
                ],
              },
            ];
          }
        });

        // Reset selections
        setSelectedBrand('');
        setSelectedMake('');
        setMakes([]);
      } catch (error) {
        console.error('Error submitting data:', error);

        const errorMessage = (error as Error).message || "There was an error submitting your selection.";

        toast({
          title: "Submission Failed",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Incomplete Selection",
        description: "Please select both a brand and a make.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Chakra UI AlertDialog for confirming table clearance
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const confirmClearTable = () => {
    setTableData([]);
    localStorage.removeItem('carRentalTableData');
    toast({
      title: "Table Cleared",
      description: "All table data has been successfully cleared.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Box bgGradient={bgGradient} minH="100vh" p={5}>
      {/* Navbar */}
      <Flex justifyContent="space-between" p={5} bg="transparent" align="center">
        <Heading as="h1" color="teal.300">Car Rental</Heading>
        <IconButton
          aria-label="Toggle dark mode"
          icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
          onClick={toggleColorMode}
        />
      </Flex>

      {/* Hero Section */}
      <Box
        position="relative"
        width="100%"
        height="500px"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="transparent"
      >
        {/* Animated Image */}
        <Image
          src={carImages[currentIndex].src}
          alt="Car Image"
          objectFit="cover"
          width="100%"
          height="500px"
          opacity={0.8}
          filter="brightness(0.9)"
          position="absolute"
        />

        {/* Text Overlay */}
        <VStack
          position="relative"
          zIndex={1}
          spacing={4}
          textAlign="center"
          color="white"
          bg="blackAlpha.600"
          p={6}
          borderRadius="md"
          maxW="600px"
          backdropFilter="blur(10px)"
        >
          <Heading as="h2" fontSize="4xl">
            {carImages[currentIndex].message}
          </Heading>

          <Button colorScheme="teal" size="lg" onClick={() => {
            const dropdownSection = document.getElementById('dropdownSection');
            if (dropdownSection) {
              dropdownSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}>
            Book Now
          </Button>
        </VStack>
      </Box>

      {/* Dropdown Menu Section */}
      <Box id="dropdownSection" p={10} mt={10}>
        <VStack
          spacing={8}
          maxW="600px"
          w="full"
          bg={useColorModeValue('gray.100', 'gray.700')}
          p={6}
          borderRadius="md"
          boxShadow="2xl"
          mx="auto"
        >
          <Text fontSize="lg" color={brandColor}>
            Select Car Brand
          </Text>
          <Select
            placeholder="Select a brand"
            value={selectedBrand}
            onChange={handleBrandChange}
            borderColor="teal.300"
            _hover={{ borderColor: 'teal.400' }}
            color={brandColor}
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </Select>

          {/* Conditional Rendering for Car Make Dropdown and Submit Button or Spinner */}
          {isLoadingMakes ? (

            <Box display="flex" justifyContent="center" alignItems="center">
              <LineScalePulseOut color={color} loading={isLoadingMakes} />
            </Box>
          ) : (
            selectedBrand && (
              <>
                <Text fontSize="lg" color={brandColor}>
                  Select Car Make
                </Text>
                <Select
                  placeholder="Select a make"
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  borderColor="teal.300"
                  _hover={{ borderColor: 'teal.400' }}
                  color={brandColor}
                >
                  {makes.map((make) => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </Select>

                {/* Submit Button */}
                <Button
                  colorScheme="teal"
                  size="lg"
                  onClick={handleSubmit}
                  isDisabled={!selectedBrand || !selectedMake}
                >
                  Submit
                </Button>
              </>
            )
          )}
        </VStack>
      </Box>

      {/* Table Section */}
      <Box p={10} mt={10} overflowX="auto">
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h2" size="lg" textAlign="center" color="teal.300">
            Selected Car Brands and Makes
          </Heading>
          {/* Clear Table Button */}
          {tableData.length > 0 && (
            <Button
              colorScheme="red"
              variant="outline"
              onClick={onOpen}
            >
              Clear Table
            </Button>
          )}
        </Flex>
        {tableData.length === 0 ? (
          <Text textAlign="center" color="gray.500">No entries yet.</Text>
        ) : (
          <Table variant="striped" colorScheme="teal" borderWidth="1px" borderColor="gray.200">
            <Thead>
              <Tr>
                <Th>S/N</Th>
                <Th>Car Brand</Th>
                <Th>Car Make</Th>
                <Th>Date Created</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tableData.map((brandEntry, brandIndex) => (
                brandEntry.makes.map((make, makeIndex) => {
                  const isLastMake = makeIndex === brandEntry.makes.length - 1;
                  return (
                    <Tr
                      key={`${brandEntry.brandName}-${make.makeName}`}
                      borderBottom={isLastMake ? "2px solid" : "1px solid"}
                      borderColor={isLastMake ? "teal.500" : "gray.200"}
                    >
                      {/* S/N: Only show for the first make of each brand */}
                      {makeIndex === 0 && (
                        <Td rowSpan={brandEntry.makes.length} fontWeight="bold">
                          {brandIndex + 1}
                        </Td>
                      )}
                      {/* Car Brand: Only show for the first make of each brand */}
                      {makeIndex === 0 && (
                        <Td rowSpan={brandEntry.makes.length} fontWeight="bold">
                          {brandEntry.brandName}
                        </Td>
                      )}
                      <Td>{make.makeName}</Td>
                      <Td>{make.dateCreated}</Td>
                    </Tr>
                  );
                })
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* AlertDialog for Clearing Table */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Clear All Table Data
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to clear all the data in the table? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmClearTable} ml={3}>
                Clear
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default CarRental;
