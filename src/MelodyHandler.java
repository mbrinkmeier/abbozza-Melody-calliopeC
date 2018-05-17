/**
 * @license
 * abbozza!
 *
 * Copyright 2015 Michael Brinkmeier ( michael.brinkmeier@uni-osnabrueck.de )
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview ...
 * @author michael.brinkmeier@uni-osnabrueck.de (Michael Brinkmeier)
 */

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import de.uos.inf.did.abbozza.plugin.PluginHandler;
import de.uos.inf.did.abbozza.core.AbbozzaLogger;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;
import javax.swing.JFileChooser;
import javax.swing.filechooser.FileNameExtensionFilter;

/**
 *
 * @author michael
 */
public class MelodyHandler extends PluginHandler {

    private File lastFile;
    
    public MelodyHandler() {
        AbbozzaLogger.out("abbozza! Melody handler instanciated",AbbozzaLogger.INFO);
        lastFile = new File(System.getProperty("user.home"));
    }

    public void handleRequest(HttpExchange exchg) throws IOException {
        String path = exchg.getRequestURI().getPath();
        String response = "";

        OutputStream os = exchg.getResponseBody();
        Headers responseHeaders = exchg.getResponseHeaders();
        
        AbbozzaLogger.info("Plugin: " + path + " requested");
 
        JFileChooser chooser = new JFileChooser(path);
        
        // Set file filter for abm files
        chooser.setFileFilter(new FileNameExtensionFilter("abbozza! Melody file (*.ly,*.mxl,*.abm, *.txt)", "ly", "mxl","abm","txt"));
        if ( lastFile.isDirectory() ) {
            chooser.setCurrentDirectory(lastFile);            
        } else {
            chooser.setSelectedFile(lastFile);
        }
        
        
        _abbozzaServer.bringFrameToFront();
        _abbozzaServer.setDialogOpen(true);
        
        // Open dialog
        int choice = chooser.showOpenDialog(null);
        if (choice == JFileChooser.APPROVE_OPTION) {
            URL url;
            File file = chooser.getSelectedFile();                
            url = file.toURI().toURL();
            lastFile = file;
            AbbozzaLogger.debug("[abbozzaMelody] file selected " + file.getAbsolutePath() );
            AbbozzaLogger.debug("[abbozzaMelody] URL: " + url.toExternalForm() );
            
            try {
              URLConnection conn = url.openConnection();
              InputStream inStream = conn.getInputStream();
              ByteArrayOutputStream baos = new ByteArrayOutputStream();
              int reads = inStream.read(); 
              while(reads != -1){ 
                  baos.write(reads); 
                  reads = inStream.read(); 
              } 
              response = baos.toString();
              responseHeaders.set("Content-Type", "text/xml");
              exchg.sendResponseHeaders(200, response.length());
              os.write(response.getBytes());
              os.close();
            } catch (IOException ex) {
              AbbozzaLogger.err(ex.getLocalizedMessage());
              AbbozzaLogger.err("[abbozzaMelody] could not open " + file.getAbsolutePath() );            
              response = "";
              responseHeaders.set("Content-Type", "text/plain");
              exchg.sendResponseHeaders(204, response.length());
              os.write(response.getBytes());
              os.close();                 
            }
          } else {
              AbbozzaLogger.debug("[abbozzaMelody] file selection aborted");            
              response = "";
              responseHeaders.set("Content-Type", "text/plain");
              exchg.sendResponseHeaders(204, response.length());
              os.write(response.getBytes());
              os.close();
          }
        
        _abbozzaServer.setDialogOpen(false);
        _abbozzaServer.resetFrame();
        _abbozzaServer.toolIconify();
    }
    
}
