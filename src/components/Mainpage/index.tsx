import React, { useState, useEffect, RefObject } from 'react';
import {
  Box, Button, Flex, Heading, Image, Text, useColorMode, useColorModeValue, IconButton, VStack, Select, Stack,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

// import car1 from "../../assets/1000_F_292000672_NYKgm6UZv0NY4cc4LlCHeDOa1tIiR9ef.jpg";
// import car2 from "../../assets/cheerful-little-african-american-daughter-600nw-2143243901.webp"
// import car3 from "../../assets/gettyimages-1419364025-612x612.jpg"
// import car4 from "../../assets/images.jpeg"
// import car5 from "../../assets/istockphoto-1301398636-612x612.jpg"
import car6 from "../../assets/slide_1-1.jpg"
import car7 from "../../assets/slide_2-1-1.jpg"
import car8 from "../../assets/slide_3-1-1.jpg" 
import { useNavigate } from 'react-router-dom';

const CarRental: React.FC = () => {
  const { toggleColorMode } = useColorMode();
  const brandColor = useColorModeValue('gray.800', 'gray.200');
  const bgGradient = useColorModeValue('linear(to-r, teal.600, blue.700)', 'linear(to-r, gray.900, blackAlpha.900)');
  const navigate = useNavigate();

 const handleNavigate = () =>{
navigate('/RoadPage');
 }
  
  const carImages = [
    // { src: car1, message: 'Explore the luxury of speed' },
    // { src: car2, message: 'Drive with comfort and class' },
    // { src: car3, message: 'Experience the future of driving' },
    // { src: car4, message: 'Unmatched performance on every road' },
    // { src: car5, message: 'The power to redefine your journey' },
    { src: car6, message: 'Innovation meets elegance' },
    { src: car7, message: 'Drive into the future with style' },
    { src: car8, message: 'Luxury redefined for every destination' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [brands, setBrands] = useState<string[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedMake, setSelectedMake] = useState<string>('');

  // Function to cycle through images and messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carImages.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, [carImages.length]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('http://localhost:5222/api/CarRental/GetCarBrand');
        const data = await response.json();
        setBrands(data.map((brand: { brandName: string }) => brand.brandName));
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);

  const handleBrandChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    setSelectedMake(''); // Clear makes when brand changes
    if (brand) {
      try {
        const response = await fetch(`http://localhost:5222/api/CarRental/GetCarMake/${brand}`);
        const data = await response.json();
        setMakes(data.map((make: { makeName: string }) => make.makeName));
      } catch (error) {
        console.error('Error fetching makes:', error);
      }
    } else {
      setMakes([]);
    }
  };

  const handleSubmit = async () => {
    if (selectedBrand && selectedMake) {
      const data = {
        CarBrandID: selectedBrand,
        CarMakeID: selectedMake,
      };

      try {
        const response = await fetch('http://localhost:5222/api/CarRental/PostSubmit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        console.log('Success:', result);
        handleNavigate()
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    } else {
      alert('Please select both a brand and a make.');
    }
  };

  // Smooth scroll function
  const handleScroll = () => {
    const dropdownSection = document.getElementById('dropdownSection');
    if (dropdownSection) {
      dropdownSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box bgGradient={bgGradient} minH="100vh">
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
         
          <Button colorScheme="teal" size="lg" onClick={handleScroll}>Book Now</Button>
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

          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleSubmit}
            isDisabled={!selectedBrand || !selectedMake}
          >
            Submit
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default CarRental;
