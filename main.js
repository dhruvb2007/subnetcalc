document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.querySelector("select");
    const inputContainer = document.querySelector(".w-full.flex.flex-col.items-center.gap-2");
    const calculateButton = document.createElement("button");

    // Apply required styles to the button
    calculateButton.textContent = "Calculate";
    calculateButton.classList.add("bg-black", "py-2", "px-3", "w-full", "max-w-md", "rounded-md", "text-white");

    function updateInputs() {
        inputContainer.innerHTML = ""; // Clear existing inputs 

        if (selectElement.value === "") return; // If no option is selected, do nothing

        const ipInput = document.createElement("input");
        ipInput.classList.add("border", "border-black", "rounded-md", "py-2", "px-3", "w-full", "max-w-md");
        ipInput.setAttribute("type", "text");
        ipInput.setAttribute("placeholder", "Enter IP Address");
        ipInput.setAttribute("id", "ip");
        inputContainer.appendChild(ipInput);

        if (selectElement.value === "subnet") {
            const subnetInput = document.createElement("input");
            subnetInput.classList.add("border", "border-black", "rounded-md", "py-2", "px-3", "w-full", "max-w-md");
            subnetInput.setAttribute("type", "text");
            subnetInput.setAttribute("placeholder", "Enter Total Subnets");
            subnetInput.setAttribute("id", "subnet");
            inputContainer.appendChild(subnetInput);
        } else if (selectElement.value === "hosts") {
            const hostInput = document.createElement("input");
            hostInput.classList.add("border", "border-black", "rounded-md", "py-2", "px-3", "w-full", "max-w-md");
            hostInput.setAttribute("type", "text");
            hostInput.setAttribute("placeholder", "Enter Required Hosts");
            hostInput.setAttribute("id", "hosts");
            inputContainer.appendChild(hostInput);
        }

        inputContainer.appendChild(calculateButton);
    }

    selectElement.addEventListener("change", updateInputs);

    calculateButton.addEventListener("click", function () {
        const selectedValue = selectElement.value;
        const ip = document.getElementById("ip")?.value;

        if (!ip) {
            alert("Please enter an IP address");
            return;
        }

        const queryParams = new URLSearchParams({ ip }).toString();

        if (selectedValue === "subnet") {
            const subnets = document.getElementById("subnet")?.value;
            if (!subnets) {
                alert("Please enter the number of subnets");
                return;
            }
            window.location.href = `BySubnet.html?${queryParams}&subnets=${subnets}`;
        } else if (selectedValue === "hosts") {
            const hosts = document.getElementById("hosts")?.value;
            if (!hosts) {
                alert("Please enter the number of hosts");
                return;
            }
            window.location.href = `ByHost.html?${queryParams}&hosts=${hosts}`;
        }
    });

    // Initialize fields on page load
    updateInputs();
});
