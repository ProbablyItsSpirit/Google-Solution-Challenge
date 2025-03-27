import os
import subprocess
import sys
import shutil
import argparse
from pathlib import Path

def generate_requirements(output_file="requirements.txt"):
    """Generate a requirements.txt file from the current environment."""
    print(f"Generating requirements file: {output_file}")
    with open(output_file, "w") as f:
        subprocess.run([sys.executable, "-m", "pip", "freeze"], stdout=f, check=True)
    print(f"✅ Requirements file created at: {output_file}")
    return output_file

def download_packages(requirements_file="requirements.txt", output_dir="packages"):
    """Download all packages listed in the requirements file."""
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Downloading packages to: {output_dir}")
    # Download packages
    subprocess.run([
        sys.executable, "-m", "pip", "download",
        "-r", requirements_file,
        "--dest", output_dir,
        "--no-binary", ":all:"  # Include source distributions
    ], check=True)
    
    # Also download wheel and setuptools which might be needed for installation
    subprocess.run([
        sys.executable, "-m", "pip", "download",
        "wheel", "setuptools", "pip",
        "--dest", output_dir
    ], check=True)
    
    print(f"✅ All packages downloaded to: {output_dir}")
    return output_dir

def create_installation_script(output_dir="packages", script_name="install_environment.py"):
    """Create a script that can install the downloaded packages."""
    script_path = os.path.join(output_dir, script_name)
    
    with open(script_path, "w") as f:
        f.write("""#!/usr/bin/env python
import os
import sys
import subprocess
import argparse

def install_packages(venv=None):
    """Install all packages in the current directory."""
    # Get the current directory (where this script is located)
    packages_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Build the pip command
    pip_cmd = [sys.executable, "-m", "pip", "install", "--no-index", "--find-links", packages_dir]
    
    # Add all .whl files
    whl_files = [f for f in os.listdir(packages_dir) if f.endswith('.whl')]
    for whl in whl_files:
        pip_cmd.append(os.path.join(packages_dir, whl))
    
    # Add all .tar.gz files
    tar_files = [f for f in os.listdir(packages_dir) if f.endswith('.tar.gz')]
    for tar in tar_files:
        pip_cmd.append(os.path.join(packages_dir, tar))
    
    # Run the installation
    print("Installing packages...")
    subprocess.run(pip_cmd, check=True)
    print("✅ All packages installed successfully!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Install all packages in the current directory.")
    parser.add_argument("--venv", help="Path to virtual environment to install packages into")
    args = parser.parse_args()
    
    install_packages(args.venv)
""")
    
    print(f"✅ Installation script created at: {script_path}")
    return script_path

def create_zip_archive(source_dir="packages", output_file="environment_packages.zip"):
    """Create a zip archive of the packages directory."""
    print(f"Creating zip archive of packages: {output_file}")
    shutil.make_archive(output_file.rsplit('.', 1)[0], 'zip', source_dir)
    print(f"✅ Zip archive created at: {output_file}")
    return output_file

def main():
    parser = argparse.ArgumentParser(description="Export Python environment for sharing.")
    parser.add_argument("--requirements", "-r", default="requirements.txt", 
                        help="Path to requirements.txt file (default: requirements.txt)")
    parser.add_argument("--download", "-d", action="store_true", 
                        help="Download packages for offline installation")
    parser.add_argument("--output-dir", "-o", default="packages",
                        help="Directory to store downloaded packages (default: packages)")
    parser.add_argument("--zip", "-z", action="store_true",
                        help="Create a zip archive of the packages")
    parser.add_argument("--zip-name", default="environment_packages.zip",
                        help="Name of the zip archive (default: environment_packages.zip)")
    
    args = parser.parse_args()
    
    # Generate requirements.txt file
    requirements_file = generate_requirements(args.requirements)
    
    if args.download:
        # Download packages
        packages_dir = download_packages(requirements_file, args.output_dir)
        
        # Create installation script
        create_installation_script(packages_dir)
        
        if args.zip:
            # Create zip archive
            create_zip_archive(packages_dir, args.zip_name)
            
        print("\n" + "="*50)
        print(f"Environment export complete! Share the '{args.output_dir}' folder with your friend.")
        if args.zip:
            print(f"Or share the '{args.zip_name}' archive for easier transfer.")
        print("="*50)
    else:
        print("\n" + "="*50)
        print(f"Requirements file generated. Share '{args.requirements}' with your friend.")
        print("They can install it using: pip install -r requirements.txt")
        print("="*50)

if __name__ == "__main__":
    main()
