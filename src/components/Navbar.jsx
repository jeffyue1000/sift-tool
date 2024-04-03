import React from "react";
import { Link } from "react-router-dom";

export default function Navbar(){
  return(
    <nav>
      <ul>
        <li>
          <Link to="/">Session Login</Link>
        </li>
        <li>
          <Link to="/compare">Compare Resumes</Link>
        </li>
        <li>
          <Link to="/rankings">Resume Rankings</Link>
        </li>
        <li>
          <Link to="/upload">Upload Resumes</Link>
        </li>
      </ul>
    </nav>
  )
}