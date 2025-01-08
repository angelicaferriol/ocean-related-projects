import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.text.SimpleDateFormat;
import java.util.Date;

public class WhaleInfoExplorer extends JFrame {
    private JPanel whaleListPanel;
    private JPanel detailsPanel;
    private JLabel whaleImageLabel;
    private JTextArea generalDescriptionArea;
    private JTextArea scientificDetailsArea;
    private JTextField searchField;
    private JButton searchButton;
    private JComboBox<String> infoComboBox;
    private JFormattedTextField dateField;

    public WhaleInfoExplorer() {
        setTitle("Whale Information Explorer");
        setSize(800, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // Create the JMenuBar
        JMenuBar menuBar = new JMenuBar();
        JMenu fileMenu = new JMenu("About");

        JMenuItem aboutItem = new JMenuItem("The Program");
        aboutItem.addActionListener(e -> showAboutDialog());
        fileMenu.add(aboutItem);

        JMenuItem creatorItem = new JMenuItem("The Creator");
        creatorItem.addActionListener(e -> showCreatorDialog());
        fileMenu.add(creatorItem);

        menuBar.add(fileMenu);
        setJMenuBar(menuBar);

        // Whale List Panel
        whaleListPanel = new JPanel();
        whaleListPanel.setLayout(new GridLayout(0, 2)); // 2 columns
        addWhaleButtons();

        // Panels for search and combo box
        JPanel topPanel = new JPanel();
        topPanel.setLayout(new BorderLayout());

        // Search Panel 
        JPanel searchPanel = new JPanel();
        searchPanel.setLayout(new FlowLayout(FlowLayout.LEFT)); // Components will be placed horizontally
        searchField = new JTextField(15);
        searchButton = new JButton("Search");
        searchButton.addActionListener(new SearchButtonListener());
        searchPanel.add(searchField);
        searchPanel.add(searchButton);

        // Info ComboBox Panel 
        JPanel infoPanel = new JPanel();
        infoPanel.setLayout(new FlowLayout(FlowLayout.RIGHT)); // Arrange components horizontally on the right
        infoComboBox = new JComboBox<>(new String[]{"Why are Whales Important?", "Whales are In Danger!"});
        infoComboBox.addActionListener(e -> showInfo(e));
        infoPanel.add(infoComboBox);

        // Add search and info panels to topPanel
        topPanel.add(searchPanel, BorderLayout.WEST);
        topPanel.add(infoPanel, BorderLayout.EAST);

        // Details Panel
        detailsPanel = new JPanel();
        detailsPanel.setLayout(new BorderLayout());

        // Date Field at the Bottom
        JPanel bottomPanel = new JPanel();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        dateField = new JFormattedTextField(dateFormat);
        dateField.setText(dateFormat.format(new Date()));
        dateField.setEditable(false);
        bottomPanel.add(dateField);

        // Add panels to the frame
        add(topPanel, BorderLayout.NORTH);
        add(whaleListPanel, BorderLayout.WEST);
        add(detailsPanel, BorderLayout.CENTER);
        add(bottomPanel, BorderLayout.SOUTH);

        setVisible(true);
    }

    private void addWhaleButtons() {
        String[] whaleSpecies = {
            "Blue Whale", "Humpback Whale", "Orca", "Gray Whale",
            "Fin Whale", "Minke Whale", "Beluga Whale", "Bowhead Whale",
            "Sperm Whale", "Narwhal", "Right Whale", "Pygmy Sperm Whale"
        };
        for (String species : whaleSpecies) {
            JButton button = new JButton(species);
            button.setToolTipText("Click to view details about " + species);
            button.addActionListener(new WhaleButtonListener(species));
            whaleListPanel.add(button);
        }
    }

    private class WhaleButtonListener implements ActionListener {
        private String species;

        public WhaleButtonListener(String species) {
            this.species = species;
        }

        @Override
        public void actionPerformed(ActionEvent e) {
            displayWhaleDetails(species);
        }
    }

    private class SearchButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            String searchText = searchField.getText().trim();
            for (Component comp : whaleListPanel.getComponents()) {
                if (comp instanceof JButton) {
                    JButton button = (JButton) comp;
                    if (button.getText().equalsIgnoreCase(searchText)) {
                        button.doClick(); // Simulate button click
                        return;
                    }
                }
            }
            JOptionPane.showMessageDialog(WhaleInfoExplorer.this, "Whale species not found.", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void displayWhaleDetails(String species) {
        detailsPanel.removeAll();

        // Whale Image
        String imagePath = "images/" + species.toLowerCase().replace(" ", "_") + ".jpg";
        ImageIcon whaleImageIcon = new ImageIcon(imagePath);

        // Check if the image exists
        if (whaleImageIcon.getImageLoadStatus() != MediaTracker.COMPLETE) {
            whaleImageIcon = new ImageIcon("images/default_image.jpg");  // Use a default image if not found
            JOptionPane.showMessageDialog(this, "Image not found for " + species + ", using default image.", "Error", JOptionPane.ERROR_MESSAGE);
        }

        // Scale the image to fit the JLabel
        Image image = whaleImageIcon.getImage();
        Image scaledImage = image.getScaledInstance(400, 300, Image.SCALE_SMOOTH); // Scale image to 400x300
        whaleImageIcon = new ImageIcon(scaledImage);

        whaleImageLabel = new JLabel(whaleImageIcon);
        whaleImageLabel.setBorder(BorderFactory.createTitledBorder("Image of " + species));
        detailsPanel.add(whaleImageLabel, BorderLayout.NORTH);

        // General Description
        generalDescriptionArea = new JTextArea(5, 30);
        generalDescriptionArea.setText(getGeneralDescription(species));
        generalDescriptionArea.setLineWrap(true);
        generalDescriptionArea.setWrapStyleWord(true);
        generalDescriptionArea.setEditable(false);
        JScrollPane generalScroll = new JScrollPane(generalDescriptionArea);
        generalScroll.setBorder(BorderFactory.createTitledBorder("General Description"));
        detailsPanel.add(generalScroll, BorderLayout.CENTER);

        // Scientific Details
        scientificDetailsArea = new JTextArea(5, 100);
        scientificDetailsArea.setText(getScientificDetails(species));
        scientificDetailsArea.setLineWrap(true);
        scientificDetailsArea.setWrapStyleWord(true);
        scientificDetailsArea.setEditable(false);
        JScrollPane scientificScroll = new JScrollPane(scientificDetailsArea);
        scientificScroll.setBorder(BorderFactory.createTitledBorder("Scientific Details"));
        detailsPanel.add(scientificScroll, BorderLayout.SOUTH);

        // Back to List Button
        JButton backButton = new JButton("Back to List");
        backButton.addActionListener(e -> {
            detailsPanel.removeAll();
            detailsPanel.revalidate();
            detailsPanel.repaint();
            JOptionPane.showMessageDialog(this, "Returning to whale list.", "Back to List", JOptionPane.INFORMATION_MESSAGE);
        });
        detailsPanel.add(backButton, BorderLayout.EAST);

        // Refresh the details panel
        detailsPanel.revalidate();
        detailsPanel.repaint();
    }

    private String getGeneralDescription(String species) {
        switch (species) {
            case "Blue Whale":
                return "The blue whale is the largest animal ever known to have lived on Earth. They can grow up to 100 feet long and weigh as much as 200 tons. Despite their massive size, they feed primarily on tiny krill.";
            case "Humpback Whale":
                return "Humpback whales are famous for their songs, which can travel great distances through the ocean. They are acrobatic creatures known for breaching and slapping the water with their fins.";
            case "Orca":
                return "Orcas, also known as killer whales, are apex predators found in every ocean. They are highly social and live in pods, exhibiting complex hunting techniques and vocal communication.";
            case "Gray Whale":
                return "Gray whales are known for their long migrations, traveling up to 12,000 miles annually. They feed by scooping up sediment from the seafloor and filtering out small organisms.";
            case "Fin Whale":
                return "The fin whale, the second-largest whale, is sleek and fast, often called the 'greyhound of the sea.' They can reach speeds of up to 23 mph.";
            case "Minke Whale":
                return "Minke whales are one of the smallest baleen whales. They are curious creatures, often seen approaching boats and showing playful behavior.";
            case "Beluga Whale":
                return "Beluga whales are called 'sea canaries' due to their high-pitched vocalizations. These Arctic whales are white and have a distinctively flexible neck.";
            case "Bowhead Whale":
                return "Bowhead whales live in Arctic and sub-Arctic waters and can break through thick ice. They are among the longest-living mammals, with lifespans over 200 years.";
            case "Sperm Whale":
                return "Sperm whales are the largest toothed whales and are known for their massive heads and deep-diving abilities. They primarily feed on giant squid in deep ocean waters.";
            case "Narwhal":
                return "Narwhals are known for their long, spiral tusks, which are actually elongated teeth. These Arctic whales are often called the 'unicorns of the sea.'";
            case "Right Whale":
                return "Right whales are slow-moving and were named by whalers as the 'right' whale to hunt due to their rich blubber and tendency to float when killed.";
            case "Pygmy Sperm Whale":
                return "Pygmy sperm whales are elusive and rarely seen. They are known for ejecting a reddish-brown ink-like substance to evade predators.";
            default:
                return "No general description available for this species.";
        }
    }
    
    private String getScientificDetails(String species) {
        switch (species) {
            case "Blue Whale":
                return "Scientific Name: Balaenoptera musculus\nHabitat: Open oceans\nDiet: Krill\nStatus: Endangered\nInteresting Fact: Blue whales can consume up to 4 tons of krill per day.";
            case "Humpback Whale":
                return "Scientific Name: Megaptera novaeangliae\nHabitat: All major oceans\nDiet: Krill and small fish\nStatus: Least Concern\nInteresting Fact: Humpback whales have unique patterns on their tails, used for identification.";
            case "Orca":
                return "Scientific Name: Orcinus orca\nHabitat: Oceans worldwide\nDiet: Fish, seals, and whales\nStatus: Data Deficient\nInteresting Fact: Orcas have cultural behaviors passed down through generations.";
            case "Gray Whale":
                return "Scientific Name: Eschrichtius robustus\nHabitat: Coastal waters\nDiet: Amphipods and small crustaceans\nStatus: Least Concern\nInteresting Fact: Gray whales migrate farther than any other mammal.";
            case "Fin Whale":
                return "Scientific Name: Balaenoptera physalus\nHabitat: Deep offshore waters\nDiet: Krill and small schooling fish\nStatus: Vulnerable\nInteresting Fact: Fin whales can grow up to 85 feet long.";
            case "Minke Whale":
                return "Scientific Name: Balaenoptera acutorostrata\nHabitat: Coastal and offshore waters\nDiet: Krill and small fish\nStatus: Least Concern\nInteresting Fact: Minke whales are the smallest baleen whales.";
            case "Beluga Whale":
                return "Scientific Name: Delphinapterus leucas\nHabitat: Arctic and sub-Arctic regions\nDiet: Fish, squid, and crustaceans\nStatus: Near Threatened\nInteresting Fact: Beluga whales can mimic human speech.";
            case "Bowhead Whale":
                return "Scientific Name: Balaena mysticetus\nHabitat: Arctic waters\nDiet: Zooplankton\nStatus: Least Concern\nInteresting Fact: Bowhead whales have the thickest blubber of any whale species.";
            case "Sperm Whale":
                return "Scientific Name: Physeter macrocephalus\nHabitat: Deep offshore waters\nDiet: Squid\nStatus: Vulnerable\nInteresting Fact: Sperm whales have the largest brain of any animal.";
            case "Narwhal":
                return "Scientific Name: Monodon monoceros\nHabitat: Arctic waters\nDiet: Fish, shrimp, and squid\nStatus: Near Threatened\nInteresting Fact: Narwhal tusks can grow up to 10 feet long.";
            case "Right Whale":
                return "Scientific Name: Eubalaena spp.\nHabitat: Coastal waters\nDiet: Zooplankton\nStatus: Critically Endangered\nInteresting Fact: Right whales have callosities on their heads that are unique to each individual.";
            case "Pygmy Sperm Whale":
                return "Scientific Name: Kogia breviceps\nHabitat: Deep ocean waters\nDiet: Squid and crustaceans\nStatus: Data Deficient\nInteresting Fact: Pygmy sperm whales are solitary and rarely seen in the wild.";
            default:
                return "No scientific details available for this species.";
        }
    }
    

    private void showAboutDialog() {
        JOptionPane.showMessageDialog(this, 
            "Whale Information Explorer\n\n" +
            "A platform dedicated to educating and raising awareness\n" +
            "about whales and their role in marine ecosystems.\n\n" +
            "Let's save the sea!",
            "About the Program", JOptionPane.INFORMATION_MESSAGE);
    }

    private void showCreatorDialog() {
        JOptionPane.showMessageDialog(this, 
            "Created by Angelica Ferriol\n\n" +
            "Computer Science Student at PUP-Sta.Mesa\n" +
            "Passionate about whales and marine conservation.\n" +
            "Let's protect our oceans together!",
            "About the Creator", JOptionPane.INFORMATION_MESSAGE);
    }

    private void showInfo(ActionEvent e) {
        String selectedItem = (String) infoComboBox.getSelectedItem();
        if (selectedItem.equals("Why are Whales Important?")) {
            JOptionPane.showMessageDialog(this, 
                "Whales play a key role in marine ecosystems by regulating food chains, \n" +
                "supporting biodiversity, and maintaining balance. Their feeding habits \n" +
                "control fish populations, and their presence aids in the health of \n" +
                "other marine species.",
                "Why are Whales Important?", JOptionPane.INFORMATION_MESSAGE);
        } else if (selectedItem.equals("Whales are In Danger!")) {
            JOptionPane.showMessageDialog(this, 
                "Whales face threats from commercial whaling, pollution, ship strikes, \n" +
                "and climate change. Rising ocean temperatures affect their migratory \n" +
                "patterns and feeding grounds, putting their survival at risk.",
                "Whales are In Danger!", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    public static void main(String[] args) {
        new WhaleInfoExplorer();
    }
}