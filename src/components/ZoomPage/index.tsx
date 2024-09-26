import { Box, Text, VStack, Image, keyframes } from '@chakra-ui/react';
import CarSVG from '../../assets/car-svgrepo-com.svg'; // Import your car SVG


// Keyframes for car movement (from left to right)
const drivingAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); } 
`;



const RoadPage = () => {
  return (
    <VStack spacing={8} minH="100vh" justify="center" align="center" bgGradient="linear(to-r, teal.100, blue.200)">
   
      <Text fontSize="5xl" fontWeight="bold" color="teal.600">
        Info received, we will get back to you soon
      </Text>


      <Box
        position="relative"
        w="full"
        h="200px"
        overflow="hidden"
        bg="black"
        borderRadius="md"
        boxShadow="lg"
      >
      
        <Box
          position="absolute"
          w="100%"
          h="10px"
          top="50%"
          bg="transparent"
          transform="translateY(-50%)"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
         
          {Array.from({ length: 12 }).map((_, index) => (
            <Box key={index} w="40px" h="10px" bg="white" mx={4} />
          ))}
        </Box>


     
        <Image
          src={CarSVG}
          alt="Car"
          position="absolute"
          bottom="10px"
          left="-100px"
          w="100px"
          h="auto"
          animation={`${drivingAnimation} 3s linear infinite`} 
        />
      </Box>
    </VStack>
  );
};

export default RoadPage;
