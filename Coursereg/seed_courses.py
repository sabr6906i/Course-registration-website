"""
Run this once to populate the database with real IITB first-year courses.
Usage:  python seed_courses.py
"""

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Coursereg.settings")
django.setup()

from APP.models import Course

courses = [
    {
        "title": "CS 101 - Computer Programming and Utilisation",
        "description": (
            "Introduction to programming using Python. Topics: basic data types, "
            "control flow, functions, recursion, lists, dictionaries, file I/O, "
            "and an introduction to object-oriented programming. Compulsory for "
            "all first-year students across all departments."
        ),
        "instructor": "Prof. Kavi Arya",
        "schedule": "Mon / Wed / Fri  8:00 - 9:00 AM",
        "capacity": 300,
    },
    {
        "title": "MA 105 - Calculus",
        "description": (
            "Real numbers, sequences and series, continuity, differentiation, "
            "mean value theorem, Taylor's theorem, Riemann integration, and an "
            "introduction to multivariable calculus. Core math course for all "
            "first-year B.Tech students."
        ),
        "instructor": "Prof. Sudhir Ghorpade",
        "schedule": "Mon / Wed / Thu  9:00 - 10:00 AM",
        "capacity": 250,
    },
    {
        "title": "MA 106 - Linear Algebra",
        "description": (
            "Systems of linear equations, matrices, determinants, vector spaces, "
            "linear transformations, eigenvalues and eigenvectors, inner product "
            "spaces, and applications to engineering problems."
        ),
        "instructor": "Prof. Anjan Gupta",
        "schedule": "Tue / Fri  10:00 - 11:00 AM",
        "capacity": 250,
    },
    {
        "title": "PH 107 - Quantum Physics and Application",
        "description": (
            "Wave-particle duality, Bohr model, Schrodinger's equation, quantum "
            "mechanics of the hydrogen atom, introduction to solid-state physics, "
            "semiconductors, and lasers. Compulsory for all first-year students."
        ),
        "instructor": "Prof. Anand Kannan",
        "schedule": "Mon / Wed / Fri  10:00 - 11:00 AM",
        "capacity": 200,
    },
    {
        "title": "PH 108 - Basics of Electricity and Magnetism",
        "description": (
            "Electrostatics, Gauss's law, electric potential, magnetostatics, "
            "Faraday's law, electromagnetic induction, Maxwell's equations, and "
            "plane electromagnetic waves. Lab sessions included."
        ),
        "instructor": "Prof. Deepa Khushalani",
        "schedule": "Tue / Thu  11:00 AM - 12:30 PM",
        "capacity": 200,
    },
    {
        "title": "CH 105 - Organic and Inorganic Chemistry",
        "description": (
            "Structure and bonding in organic molecules, functional groups, "
            "reaction mechanisms, aromaticity, stereochemistry, and coordination "
            "chemistry. Lab practicals are a key component of this course."
        ),
        "instructor": "Prof. Dhiman Sarkar",
        "schedule": "Mon / Wed / Fri  12:00 - 1:00 PM",
        "capacity": 180,
    },
    {
        "title": "BB 101 - Biology",
        "description": (
            "Cell biology, genetics, DNA replication, transcription, translation, "
            "biochemistry, and an introduction to biotechnology and its real-world "
            "applications in medicine and industry."
        ),
        "instructor": "Prof. Sanjeeva Srivastava",
        "schedule": "Tue / Thu  2:00 - 3:30 PM",
        "capacity": 250,
    },
    {
        "title": "HS 101 - Economics",
        "description": (
            "Microeconomics: demand, supply, consumer theory, and market structures. "
            "Macroeconomics: national income accounting, money, banking, inflation, "
            "fiscal policy, and an introduction to the Indian economy."
        ),
        "instructor": "Prof. Bharat Ramaswami",
        "schedule": "Mon / Wed / Fri  2:00 - 3:00 PM",
        "capacity": 200,
    },
    {
        "title": "ME 119 - Engineering Drawing and Computer Graphics",
        "description": (
            "Principles of orthographic and isometric projection, sectional views, "
            "dimensioning conventions, and introduction to AutoCAD and 3D modelling. "
            "Hands-on drawing sessions every week."
        ),
        "instructor": "Prof. Sharat Chandran",
        "schedule": "Wed / Thu  3:00 - 5:00 PM",
        "capacity": 120,
    },
    {
        "title": "CE 102 - Engineering Mechanics",
        "description": (
            "Statics: equilibrium of particles and rigid bodies, trusses, frames, "
            "friction. Dynamics: kinematics and kinetics of particles, Newton's "
            "laws, work-energy and impulse-momentum methods."
        ),
        "instructor": "Prof. C. S. Manohar",
        "schedule": "Tue / Thu  9:00 - 10:30 AM",
        "capacity": 150,
    },
    {
        "title": "EE 101 - Introduction to Electrical and Electronic Circuits",
        "description": (
            "Circuit elements, KVL and KCL, nodal and mesh analysis, Thevenin's "
            "and Norton's theorems, AC circuit analysis, phasors, power, and basic "
            "electronics including diodes and transistors."
        ),
        "instructor": "Prof. Vikram Gadre",
        "schedule": "Mon / Wed / Fri  11:00 AM - 12:00 PM",
        "capacity": 220,
    },
    {
        "title": "CS 213 - Data Structures and Algorithms",
        "description": (
            "Arrays, linked lists, stacks, queues, binary trees, heaps, hash tables, "
            "graphs, sorting algorithms, searching, algorithm design paradigms "
            "(greedy, divide-and-conquer, dynamic programming), and complexity analysis."
        ),
        "instructor": "Prof. Umesh Bellur",
        "schedule": "Tue / Thu / Fri  10:00 - 11:00 AM",
        "capacity": 180,
    },
]

created = 0
skipped = 0

for data in courses:
    obj, was_created = Course.objects.get_or_create(title=data["title"], defaults=data)
    if was_created:
        print("  Created:", obj.title)
        created += 1
    else:
        print("  Skipped (already exists):", obj.title)
        skipped += 1

print("\nDone.", created, "created,", skipped, "skipped.")
