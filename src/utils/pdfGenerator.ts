import jsPDF from 'jspdf';

interface DietChart {
  goal: string;
  concern: string;
  restrictions: string;
  generated_at: string;
  recommendations: string[];
}

interface Patient {
  name: string;
  age: number;
  gender: string;
  height?: number;
  weight?: number;
  food_preferences?: string;
  food_restrictions?: string;
}

export const generateDietPDF = (patient: Patient, dietChart: DietChart) => {
  const doc = new jsPDF();
  
  // Set up fonts and colors
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(76, 175, 80); // Primary green color
  
  // Header
  doc.text('Ved-Aahaar - Ayurvedic Diet Plan', 20, 30);
  
  // Add decorative line
  doc.setDrawColor(76, 175, 80);
  doc.setLineWidth(1);
  doc.line(20, 35, 190, 35);
  
  // Patient Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Patient Information', 20, 50);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  let yPos = 60;
  
  doc.text(`Name: ${patient.name}`, 20, yPos);
  yPos += 8;
  doc.text(`Age: ${patient.age} years`, 20, yPos);
  yPos += 8;
  doc.text(`Gender: ${patient.gender}`, 20, yPos);
  yPos += 8;
  
  if (patient.height) {
    doc.text(`Height: ${patient.height} cm`, 20, yPos);
    yPos += 8;
  }
  
  if (patient.weight) {
    doc.text(`Weight: ${patient.weight} kg`, 20, yPos);
    yPos += 8;
  }
  
  if (patient.food_preferences) {
    doc.text(`Food Preferences: ${patient.food_preferences}`, 20, yPos);
    yPos += 8;
  }
  
  if (patient.food_restrictions) {
    doc.text(`Food Restrictions: ${patient.food_restrictions}`, 20, yPos);
    yPos += 8;
  }
  
  yPos += 10;
  
  // Diet Plan Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Diet Plan Details', 20, yPos);
  yPos += 15;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  doc.text(`Health Goal: ${dietChart.goal}`, 20, yPos);
  yPos += 8;
  doc.text(`Primary Concern: ${dietChart.concern}`, 20, yPos);
  yPos += 8;
  doc.text(`Dietary Restrictions: ${dietChart.restrictions}`, 20, yPos);
  yPos += 8;
  doc.text(`Generated On: ${new Date(dietChart.generated_at).toLocaleDateString()}`, 20, yPos);
  yPos += 15;
  
  // Recommendations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Ayurvedic Recommendations', 20, yPos);
  yPos += 15;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  dietChart.recommendations.forEach((recommendation, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${recommendation}`, 170);
    doc.text(lines, 20, yPos);
    yPos += lines.length * 6 + 3;
  });
  
  yPos += 10;
  
  // Sample Meal Plan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Sample Daily Meal Plan', 20, yPos);
  yPos += 15;
  
  const meals = [
    {
      time: 'Early Morning (6:00 AM)',
      meal: 'Warm water with lemon and ginger'
    },
    {
      time: 'Breakfast (8:00 AM)',
      meal: 'Oatmeal with almonds, dates, and warm milk'
    },
    {
      time: 'Mid-Morning (10:30 AM)',
      meal: 'Herbal tea (tulsi or ginger)'
    },
    {
      time: 'Lunch (12:30 PM)',
      meal: 'Rice, dal, seasonal vegetables, and buttermilk'
    },
    {
      time: 'Evening (4:00 PM)',
      meal: 'Fresh fruit or herbal tea with digestive spices'
    },
    {
      time: 'Dinner (7:00 PM)',
      meal: 'Light khichdi with ghee and steamed vegetables'
    }
  ];
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  meals.forEach(meal => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 30;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(meal.time, 20, yPos);
    doc.setFont('helvetica', 'normal');
    const mealLines = doc.splitTextToSize(meal.meal, 150);
    doc.text(mealLines, 20, yPos + 6);
    yPos += 6 * mealLines.length + 8;
  });
  
  // Footer
  if (yPos > 260) {
    doc.addPage();
    yPos = 30;
  }
  
  yPos += 20;
  doc.setDrawColor(76, 175, 80);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('This diet plan is generated based on Ayurvedic principles. Please consult with a healthcare professional before making significant dietary changes.', 20, yPos);
  yPos += 6;
  doc.text('Ved-Aahaar - Bridging ancient wisdom with modern technology', 20, yPos);
  
  // Save the PDF
  doc.save(`Ved-Aahaar-Diet-Plan-${patient.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
};