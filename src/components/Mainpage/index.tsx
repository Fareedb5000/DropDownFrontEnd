import React, { useEffect, useState } from 'react';
import { Box, Button, Select, VStack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const CarRental: React.FC = () => {
    const [brands, setBrands] = useState<string[]>([]);
    const [makes, setMakes] = useState<string[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [selectedMake, setSelectedMake] = useState<string>('');
    const navigate = useNavigate();



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
                handleNavigate(); // Call the navigate function on success
            } catch (error) {
                console.error('Error submitting data:', error);
            }
        } else {
            alert('Please select both a brand and a make.');
        }
    };

    const handleNavigate = () => {
        navigate('/RoadPage'); // Change to your desired path
    };

    return (
        <Box 
            p={5} 
            minH="100vh" 
            bgGradient="linear(to-r, teal.100, blue.200)" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
        >
            <VStack spacing={8} maxW="400px" w="full" bg="white" p={6} boxShadow="lg" borderRadius="lg">
                <Text fontSize="lg" color="teal.800" mb={4} textAlign="center">
                    Select Car Brand
                </Text>
                <Select 
                    placeholder="Select a brand" 
                    value={selectedBrand} 
                    onChange={handleBrandChange}
                    borderColor="teal.500"
                >
                    {brands.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </Select>

                <Text fontSize="lg" color="teal.800" mb={4} textAlign="center">
                    Select Car Make
                </Text>
                <Select 
                    placeholder="Select a make" 
                    value={selectedMake} 
                    onChange={(e) => setSelectedMake(e.target.value)} 
                    borderColor="teal.500"
                >
                    {makes.map((make) => (
                        <option key={make} value={make}>{make}</option>
                    ))}
                </Select>

                <Button 
                    colorScheme="teal" 
                    onClick={handleSubmit} 
                    size="lg"
                    isDisabled={!selectedBrand || !selectedMake} // Disable until selections are made
                >
                    Submit
                </Button>
            </VStack>
        </Box>
    );
};

export default CarRental;
